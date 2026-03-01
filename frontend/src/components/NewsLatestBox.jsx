import React, { useState } from "react";
import { toast } from "react-toastify";

const NewsLatestBox = () => {
    const [email, setEmail] = useState("");

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        try {
            // TODO: Add your newsletter subscription API endpoint here
            // const response = await axios.post("/api/newsletter/subscribe", { email });
            
            toast.success("Successfully subscribed!");
            setEmail("");
        } catch (error) {
            toast.error("Subscription failed. Please try again.");
        }
    };

    return (
        <div className="text-center">
            <p className="text-2xl font-medium text-gray-800">
                Subscribe now & get 20% off
            </p>
            <p className="text-gray-400 mt-3">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa nesciunt
                a at minima accusantium quam iusto ratione nulla neque dicta eos, non
                molestias excepturi recusandae sapiente quasi eaque. Veritatis, animi.
            </p>
            <form onSubmit={onSubmitHandler} className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3">
                <input 
                    type="email" 
                    placeholder="Enter your Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="w-full sm:flex-1 outline-none"
                />
                <button type="submit" className="bg-black text-white text-xs px-10 py-4">
                    SUBSCRIBE
                </button>
            </form>
        </div>
    );
};

export default NewsLatestBox;