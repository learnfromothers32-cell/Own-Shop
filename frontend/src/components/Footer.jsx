import React from "react";
import { assets } from "../assets/assets";

function footer() {
  return (
    <div>
      <div className=" flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm ">
        <div>
          <img src={assets.logo} alt="" className="mb-5 w-32 " />
          <p className="w-full md:w-2/3 text-gray-600">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo culpa
            earum pariatur a nulla voluptate quas rem aliquam labore at eum
            quis, explicabo ipsum? Vel aspernatur explicabo porro accusantium
            inventore!
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div className="text-xl font-medium mb-5">
          <p>GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+233 538-281-749</li>
            <li>asantekelvin229@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          CopyRight 2025 forever.com-All Right Reserved
        </p>
      </div>
    </div>
  );
}

export default footer;
