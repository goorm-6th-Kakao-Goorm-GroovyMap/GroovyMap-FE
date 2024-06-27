import React from 'react';

const SkeletonLoader: React.FC = () => {
    return (
        <div className="animate-pulse flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg">
                <div className="flex items-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-gray-300 mr-4" />
                    <div className="flex flex-col space-y-2">
                        <div className="w-24 h-6 bg-gray-300 rounded" />
                        <div className="w-32 h-4 bg-gray-300 rounded" />
                        <div className="w-40 h-4 bg-gray-300 rounded" />
                    </div>
                </div>
                <div className="space-y-2 mb-6">
                    <div className="h-8 bg-gray-300 rounded" />
                    <div className="h-8 bg-gray-300 rounded" />
                    <div className="h-8 bg-gray-300 rounded" />
                    <div className="h-8 bg-gray-300 rounded" />
                </div>
                <div className="flex space-x-4 mt-6">
                    <div className="w-24 h-10 bg-gray-300 rounded" />
                    <div className="w-24 h-10 bg-gray-300 rounded" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonLoader;
