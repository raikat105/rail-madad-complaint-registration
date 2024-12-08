# !pip install accelerate
# !pip install flash_attn einops timm
# !pip install groq
# !pip install moviepy

import textwrap
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image, ImageDraw, ImageFont
from transformers import AutoProcessor, AutoModelForCausalLM
from groq import Groq
from moviepy.editor import VideoFileClip
import openai

device = 'cuda'
model_id = 'microsoft/Florence-2-base'
groq_api_key = "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"
openai_api_key = "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"
model = AutoModelForCausalLM.from_pretrained(model_id, device_map = device, trust_remote_code=True).eval()
processor = AutoProcessor.from_pretrained(model_id, device_map = device, trust_remote_code=True)
client = Groq(api_key=groq_api_key)
openai.api_key = openai_api_key

conversation_history = [
    {
        "role": "system",
        "content": "picture which is depicted in form of text in a format of frames , the story is the series of event happened in the video you will depict it",
    }
]

conversation_history.append(
    {
        "role": "user",
        "content": "Say nothing, and wait for the video frames input in the format frame1:,frame2: .........",
    }
)

chat_completion = client.chat.completions.create(
    messages=conversation_history,
    model="llama3-8b-8192",
)

print(chat_completion.choices[0].message.content)

conversation_history.append(
    {
        "role": "assistant",
        "content": chat_completion.choices[0].message.content,
    }
)

def send_message(user_message):
    conversation_history.append(
        {
            "role": "user",
            "content": user_message,
        }
    )

    chat_completion = client.chat.completions.create(
        messages=conversation_history,
        model="llama3-8b-8192",
    )

    response = chat_completion.choices[0].message.content
    conversation_history.append(
        {
            "role": "assistant",
            "content": response,
        }
    )

    return response

def clear_chat():
    global conversation_history
    conversation_history = [
        {
            "role": "system",
            "content": "In the video you will depict it and also give points what is happend in the scene",
            }
    ]
    
def generate_labels(task_prompt, image, text_input=None):
    if text_input is None:
        prompt = task_prompt
    else:
        prompt = task_prompt + text_input

    inputs = processor(text=prompt, images=image, return_tensors="pt").to(device)

    generated_ids = model.generate(
      input_ids=inputs["input_ids"],
      pixel_values=inputs["pixel_values"],
      max_new_tokens=1024,
      early_stopping=False,
      do_sample=False,
      num_beams=3,
    )

    generated_text = processor.batch_decode(generated_ids, skip_special_tokens=False)[0]

    output = processor.post_process_generation(
        generated_text,
        task=task_prompt,
        image_size=(image.width, image.height)
    )

    return output

def extract_audio_and_transcribe(input_video):
    output_audio = "output.mp3"
    video = VideoFileClip(input_video)
    video.audio.write_audiofile(output_audio)
    with open(output_audio, "rb") as file:
        transcription = client.audio.transcriptions.create(
            file=(output_audio, file.read()),
            model="whisper-large-v3-turbo",
            prompt="Specify context or spelling",
            response_format="json",
            # language="en",
            temperature=0.0
        )
        return transcription.text
    
import cv2
from tqdm import tqdm


def process_video(video_path):
    cap = cv2.VideoCapture(video_path)
    fps = 2
    original_fps = int(cap.get(cv2.CAP_PROP_FPS))
    frame_interval = max(original_fps // fps, 1)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    captions = []
    frame_count = 0

    with tqdm(total=total_frames, desc="Processing Video Frames", unit="frame") as pbar:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            if frame_count % frame_interval == 0:
                pil_image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
                task_prompt = ""
                long_caption = list(generate_labels(task_prompt, pil_image).values())[0]
                formatted_caption = '\n'.join(textwrap.wrap(long_caption))
                if "No object detected" in formatted_caption or "loc_" in formatted_caption:
                  formatted_caption = ""
                  captions.append(f"")
                else:
                  captions.append(f"frame{frame_count}: {formatted_caption}")

            frame_count += 1
            pbar.update(1)

    cap.release()
    return ', '.join(captions)

promptRuleSet = {
  "PassengerSafety": {
    "Immediate": [
      "Accidents",
      "Fires",
      "Derailments",
      "Any situation that endangers lives"
    ],
    "Later": [
      "Potential safety hazards (e.g., cracked seats, missing emergency instructions)"
    ]
  },
  "OperationalImpact": {
    "Immediate": [
      "Signal failures",
      "Train delays",
      "Disruption of services that affect schedules or passenger journeys"
    ],
    "Later": [
      "Minor delays",
      "Grievances about operational inefficiencies"
    ]
  },
  "HygieneAndCleanliness": {
    "Immediate": [
      "Overflowing toilets",
      "Pest infestations",
      "Unhygienic pantry conditions leading to health risks"
    ],
    "Later": [
      "General untidiness",
      "Sporadic lapses in cleaning"
    ]
  },
  "PassengerComfort": {
    "Immediate": [
      "Broken air-conditioning",
      "Broken heating",
      "Lighting issues in reserved compartments"
    ],
    "Later": [
      "Seat discomfort",
      "Minor noise disturbances",
      "Availability of blankets in AC coaches"
    ]
  },
  "TicketingAndReservation": {
    "Immediate": [
      "Duplicate seat allocations",
      "E-ticket failures",
      "Critical booking errors"
    ],
    "Later": [
      "Complaints about pricing",
      "Waitlist updates"
    ]
  },
  "GrievancesAgainstStaff": {
    "Immediate": [
      "Harassment",
      "Abuse",
      "Misconduct by railway staff"
    ],
    "Later": [
      "Rudeness",
      "Inefficiency not posing immediate harm"
    ]
  },
  "DepartmentsResponsibleForAddressingIssues": {
    "Safety": {
      "Departments": [
        "Railway Protection Force (RPF)",
        "Safety Directorate"
      ],
      "Responsibilities": [
        "Ensuring passenger safety",
        "Investigating incidents",
        "Responding to emergencies"
      ]
    },
    "Operations": {
      "Departments": ["Operations Department"],
      "Responsibilities": [
        "Managing train schedules",
        "Signal systems",
        "Traffic coordination"
      ]
    },
    "Engineering": {
      "Departments": ["Civil Engineering Department"],
      "Responsibilities": [
        "Maintenance of tracks",
        "Maintenance of bridges",
        "Maintenance of station infrastructure"
      ]
    },
    "ElectricalAndMechanicalMaintenance": {
      "Departments": ["Electrical and Mechanical Engineering Department"],
      "Responsibilities": [
        "Upkeep of train equipment (air-conditioning, lighting, engines)"
      ]
    },
    "HygieneAndSanitation": {
      "Departments": ["Environment & Housekeeping Management (E&HM)"],
      "Responsibilities": [
        "Cleaning of coaches",
        "Cleaning of platforms",
        "Cleaning of stations"
      ]
    },
    "CommercialServices": {
      "Departments": ["Commercial Department"],
      "Responsibilities": [
        "Addressing ticketing issues",
        "Passenger amenities",
        "Catering complaints"
      ]
    },
    "SignalingAndCommunication": {
      "Departments": ["Signal and Telecommunications Department"],
      "Responsibilities": [
        "Maintenance of signaling equipment",
        "Wi-Fi services",
        "Communication systems"
      ]
    },
    "GrievanceRedressal": {
      "Departments": ["Public Grievance Department"],
      "Responsibilities": [
        "Centralized handling of passenger complaints via RailMadad or helpline services"
      ]
    },
    "CateringAndOnboardServices": {
      "Departments": ["Indian Railway Catering and Tourism Corporation (IRCTC)"],
      "Responsibilities": [
        "Handling food and beverage-related complaints"
      ]
    }
  }
}

#Output Response

promptOutputres = {
    "Issue-Type":"the issue over here",
    "Concerned-Department":"Name of the concerned department",
    "Issue-Priority-type":"give the priority type"}

import json

def get_response(input_text_message):
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a complaint classifier system. Using the rule set: "
                    + str(promptRuleSet)
                    + " of Indian Railways Railmadad, you will identify the issue and "
                    "return the chat as only JSON not with any text or ``` with the following format: "
                    + str(promptOutputres)
                    + ".The classification should prioritize the audio transcription over the video frame text."
                ),
            },
            {"role": "user", "content": input_text_message},
        ],
        temperature=0.5,
        max_tokens=1024,
        top_p=0.65,
        stream=True,
        stop=None,
    )

    # Collect the streaming response
    response = ""
    for chunk in completion:
        response += chunk.choices[0].delta.content or ""

    res = json.dumps(response.strip())
    return res


video_path = "video2.mp4"

video_audio_transcribed = extract_audio_and_transcribe(video_path)
captions_output = process_video(video_path)
captions_output = captions_output.replace("\n", "")
clear_chat()
video_classified_message = send_message(captions_output)
input_text_message = "audio_data :"+ video_audio_transcribed +", video_data :"+ video_classified_message + "."

# print(input_text_message)
print(get_response(input_text_message))