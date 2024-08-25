import React from "react";
import { Link } from "react-router-dom";


const BottomDiv = ({ text, link, route }) => {
  return (
    <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
      <p className="text-sm text-gray-400">
        {text}{" "}
        <Link to={route} className="text-green-400 hover:underline">
          {link}
        </Link>
      </p>
    </div>
  );
};

export default BottomDiv;
