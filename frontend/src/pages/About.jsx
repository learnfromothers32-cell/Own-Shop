import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLatestBox from "../components/NewsLatestBox";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt=""
        />

        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Necessitatibus minima unde iusto iure aliquam veritatis commodi est,
            libero cupiditate quam aut cum, ab sit nihil quod veniam explicabo
            accusamus voluptas?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi,
            eius ipsum, porro blanditiis laborum repudiandae et neque velit,
            tenetur nisi sit reiciendis enim accusamus. Perferendis enim nisi
            possimus tempore quis.
          </p>
          <b className="text-gray-800">Our Mission </b>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt
            facere ut voluptas odio non vero molestiae a illum officia! Quam
            voluptate corporis et dolores vero eos ducimus deleniti delectus
            commodi?
          </p>
        </div>
      </div>

      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US "} />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            Loreipsum dolor sit amet consectetur adipisicing elit. Quasi
            exercitationem alias eaque molestias fuga optio quae! Quasi ipsa
            ducimus modi debitis reprehenderit nisi placeat quos? Quia eum
            voluptate maxime blanditiis?
          </p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-gray-600">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi
            exercitationem alias eaque molestias fuga optio quae! Quasi ipsa
            ducimus modi debitis reprehenderit nisi placeat quos? Quia eum
            voluptate maxime blanditiis?
          </p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
            voluptate qui dolorum doloremque commodi fugiat architecto,
            necessitatibus ex quo explicabo deleniti possimus iure ratione
            repellendus? Aut, illo? Quo, esse voluptatibus?
          </p>
        </div>
      </div>

      <NewsLatestBox />
    </div>
  );
};

export default About;
