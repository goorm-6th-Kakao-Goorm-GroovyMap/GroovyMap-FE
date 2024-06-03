'use client';

import { FaBell, FaPaperPlane } from 'react-icons/fa';
import { IoMdPerson } from 'react-icons/io';

const RightSidebar = () => {
    return (
        <div className="w-64 bg-purple-50 p-6 flex flex-col justify-between h-full">
            <div className="flex flex-row items-center justify-around mb-4 mt-6">
                <FaPaperPlane size={24} className="text-black" />
                <FaBell size={24} className="text-black" />
                <div className="bg-purple-700 p-2 rounded-full">
                    <IoMdPerson size={24} className="text-white" />
                </div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center flex-grow flex items-center justify-center">
                <p className="text-gray-700 font-semibold text-xl">버스킹 링크</p>
            </div>
        </div>
    );
};

export default RightSidebar;
