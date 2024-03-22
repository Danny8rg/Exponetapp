import React from 'react';
import '../ContactUs/ContactUs.css'

const ContactUs = () => {
    return (
        <div className="flex min-h-full flex-1 flex-col justify-center  items-center px-6 py-12 bg-white lg:px-8 container-contactus">
            <h1 className="mt-2 mb-4 text-center font-bold leading-9 tracking-tight text-gray-900 title-contact">Contáctanos</h1>
            <form className="w-2/5 py-8 px-4 flex flex-col items-center justify-center space-y-6 rounded-md shadow-sm bg-gray-50 form-contact">
                <div className='min-w-full'>
                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 label-contact">Nombre</label>
                    <input
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 input-contact"
                        id="name"
                        type="text"
                        placeholder="Nombre"
                    />
                </div>
                <div className='min-w-full'>
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 label-contact">Correo electrónico</label>
                    <input
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 input-contact"
                        id="email"
                        type="email"
                        placeholder="example@mail.com"
                    />
                </div>
                <div className='min-w-full'>
                    <label htmlFor="message" className="block text-sm font-medium leading-6 text-gray-900 label-contact">Mensaje</label>
                    <textarea
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 resize-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 textarea-contact"
                        id="message"
                        placeholder="Mensaje"
                        rows="6"
                    ></textarea>
                </div>
                <div className='min-w-full flex items-center justify-center'>
                    <button
                        className="flex w-20 justify-center rounded-md px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm btn-send button-contact"
                        type="button"
                    >
                        Enviar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactUs;