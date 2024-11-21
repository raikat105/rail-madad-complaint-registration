import React from "react";
import "./Body.css";
import TrainImage from "../Assets/Train.jpg";

const Body = () => {
  return (
    <div
      className="body text-black"
      style={{
        backgroundImage: `url(${TrainImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh", // Full viewport height
        width: "100%", // Full viewport width
      }}
    >
      <div className="flex justify-center items-center min-h-screen text-black">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-xl font-semibold text-red-600">
            Grievance Detail
          </h2>
          <p className="text-sm text-right text-red-500">* Mandatory Fields</p>

          <form className="space-y-6 mt-4">
            <div className="flex items-center space-x-4">
              <div className="flex-grow">
                <label
                  htmlFor="contact_no"
                  className="block text-lg font-medium text-black"
                >
                  Mobile No.
                </label>
                <input
                  type="text"
                  id="contact_no"
                  name="contact_no"
                  maxLength="10"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 text-black"
                />
              </div>
              <button
                type="button"
                className="bg-red-700 text-white font-semibold px-4 py-2 rounded-md text-white"
              >
                Get OTP
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
              <div>
                <label htmlFor="pmode" className="block text-lg font-medium text-black">
                  Journey Details *
                </label>
                <select
                  name="pmode"
                  id="pmode"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 text-black"
                >
                  <option value="PNR">PNR</option>
                  <option value="UTS">UTS</option>
                </select>
              </div>
              <div>
                <label htmlFor="pnr_no" className="block text-lg font-medium">
                  PNR No *
                </label>
                <input
                  type="text"
                  id="pnr_no"
                  name="pnr_no"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-lg font-medium">
                  Type *
                </label>
                <select
                  name="type"
                  id="type"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                >
                  <option value="">--Select--</option>
                  {/* Add more options here */}
                </select>
              </div>
              <div>
                <label htmlFor="sub_type" className="block text-lg font-medium">
                  Sub Type *
                </label>
                <input
                  type="text"
                  id="sub_type"
                  name="sub_type"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="incident_date"
                className="block text-lg font-medium"
              >
                Incident Date *
              </label>
              <input
                type="datetime-local"
                id="incident_date"
                name="incident_date"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
              />
            </div>

            <div>
              <label
                htmlFor="upload_file"
                className="block text-lg font-medium"
              >
                Upload File
              </label>
              <input
                type="file"
                id="upload_file"
                name="upload_file"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                accept=".pdf, .jpg, .jpeg, .png, .mp4"
              />
              <p className="text-sm text-gray-500 mt-1">
                (Only PDF, JPG, JPEG, PNG, MP4 up to 5 MB)
              </p>
            </div>

            <div>
              <label
                htmlFor="grievance_description"
                className="block text-lg font-medium"
              >
                Grievance Description *
              </label>
              <textarea
                id="grievance_description"
                name="grievance_description"
                rows="4"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
              />
              <p className="text-sm text-gray-500 mt-1">
                Note: special characters [@ # $ ^ ; & * = + % , .] are not
                permitted
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="reset"
                className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md"
              >
                Reset
              </button>
              <button
                type="submit"
                className="bg-pink-600 text-white font-semibold px-4 py-2 rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Body;
