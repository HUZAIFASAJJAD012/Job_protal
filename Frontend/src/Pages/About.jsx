import React from "react";

const AboutUs = () => {
    return (
        <>
            <section className="bg-white mx-auto mt-5" style={{height: "600px", width: "87%"}}>
                <div className="container mx-auto px-4 h-full">
                <h1 className="text-[42px] font-extrabold mt-2 mb-3">About Us</h1>
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden shadow-lg h-full">
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{backgroundImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-12-21%20234547-10D5DLrL80fLYA5En2D0XV5JInFFWv.png')"}}
                        ></div>
                        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                        {/* Content */}
                        <div className="relative z-10 p-8 md:p-16 text-white flex items-center h-full">
                            <div className="w-full md:w-1/2">
                                <h2 className="text-4xl font-bold mb-4">
                                    Reliable. <span className="text-green-500">Flexible.</span> Seamless.
                                </h2>
                                <p className="text-lg leading-relaxed mb-8">
                                    We simplify the process of connecting schools with qualified cover
                                    teachers. Our platform is designed to provide schools with
                                    reliable, vetted professionals ready to step in on short notice,
                                    ensuring that teaching continues smoothly without interruption.
                                </p>

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                    <button
                                        className="px-6 py-3 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600 transition">
                                        Sign Up Now
                                    </button>
                                    <button
                                        className="px-6 py-3 bg-white text-green-500 border border-green-500 rounded-md font-semibold hover:bg-green-500 hover:text-white transition">
                                        View Our Pricing Plans
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AboutUs;
