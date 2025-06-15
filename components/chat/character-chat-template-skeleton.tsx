'use client';

import React from 'react';
import { ArrowLeft, Send, ImageIcon, Gift, Camera, Paperclip, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import SafeImage from '../safe-image';
import Image from "next/image";

export default function CharacterChatTemplateSkeleton() {
    return (
        <div className="h-screen flex flex-col md:flex-row md:mx-auto bg-black text-white">
            {/* Mobile Layout */}
            <div className="md:hidden flex flex-col h-full">
                <header className="flex items-center p-4 border-b border-zinc-800">
                    <button className="mr-3">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex items-center flex-1 cursor-pointer">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                            <SafeImage
                                src="/placeholder.svg?height=40&width=40"
                                alt="Character"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                        </div>
                        <div className={"flex flex-col gap-2"}>
                            <h2 className="font-semibold w-40 h-6 bg-zinc-700"></h2>
                            <div className="text-xs text-zinc-400 w-20 h-2 bg-zinc-700"></div>
                        </div>
                    </div>
                    <div className="ml-auto">
                        <button>
                            <MoreHorizontal size={24} />
                        </button>
                    </div>
                </header>

                <div className="bg-zinc-800 p-4 flex justify-around">
                    <button className="flex flex-col items-center text-xs">
                        <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center mb-1">
                            <ImageIcon size={20} />
                        </div>
                        Photo
                    </button>
                    <button className="flex flex-col items-center text-xs">
                        <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center mb-1">
                            <Camera size={20} />
                        </div>
                        Roleplay
                    </button>
                    <button className="flex flex-col items-center text-xs">
                        <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center mb-1">
                            <Paperclip size={20} />
                        </div>
                        NSFW
                    </button>
                    <button className="flex flex-col items-center text-xs">
                        <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center mb-1">
                            <Gift size={20} />
                        </div>
                        Gift
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="flex justify-start">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                            <SafeImage
                                src="/placeholder.svg?height=32&width=32"
                                alt="Character"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="max-w-[75%]">
                            <div className="p-4 h-12 w-48 rounded-2xl bg-zinc-800 rounded-tl-none" />
                            <p className="text-xs text-zinc-500 mt-1">12:34 PM</p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="max-w-[75%]">
                            <div className="p-4 h-12 w-48 rounded-2xl bg-pink-500 rounded-tr-none" />
                            <p className="text-xs text-zinc-500 mt-1">12:35 PM</p>
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                            <SafeImage
                                src="/placeholder.svg?height=32&width=32"
                                alt="Character"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="max-w-[75%]">
                            <div className="p-4 h-12 w-48 rounded-2xl bg-zinc-800 rounded-tl-none" />
                            <p className="text-xs text-zinc-500 mt-1">12:36 PM</p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="max-w-[75%]">
                            <div className="p-4 h-12 w-48 rounded-2xl bg-pink-500 rounded-tr-none" />
                            <p className="text-xs text-zinc-500 mt-1">12:37 PM</p>
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                            <SafeImage
                                src="/placeholder.svg?height=32&width=32"
                                alt="Character"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="bg-zinc-800 text-white rounded-tl-none rounded-2xl p-4">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-zinc-400 rounded-full" />
                                <div className="w-2 h-2 bg-zinc-400 rounded-full" />
                                <div className="w-2 h-2 bg-zinc-400 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-zinc-800">
                    <div className="flex items-center">
                        <div className="relative p-2 mr-2 text-zinc-400 hover:text-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                />
                            </svg>
                        </div>
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="w-full bg-zinc-800 rounded-full py-3 px-4 pr-12"
                            />
                        </div>
                        <button className="p-3 ml-2 rounded-full bg-zinc-700 text-white">
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex h-[85%] w-full rounded-xl overflow-hidden border border-zinc-800">
                <div className="w-full flex flex-col">
                    <div className="p-4 border-b border-zinc-800 flex items-center">
                        <div className="flex items-center flex-1 cursor-pointer">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                                <Image
                                    src="/placeholder.svg?height=40&width=40"
                                    alt="Character"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <h2 className="font-semibold w-40 h-6 bg-zinc-700"></h2>
                                <div className="text-xs text-zinc-400 w-20 h-2 bg-zinc-700"></div>
                            </div>
                        </div>
                        <div className="ml-auto flex space-x-4">
                            <button className="text-zinc-400 hover:text-white">
                                <ImageIcon size={20} />
                            </button>
                            <button className="text-zinc-400 hover:text-white">
                                <Camera size={20} />
                            </button>
                            <button className="text-zinc-400 hover:text-white">
                                <Paperclip size={20} />
                            </button>
                            <button className="text-zinc-400 hover:text-white">
                                <Gift size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="flex justify-start">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                                <SafeImage
                                    src="/placeholder.svg?height=40&width=40"
                                    alt="Character"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="max-w-[60%]">
                                <div className="p-4 h-12 w-48 rounded-2xl bg-zinc-800 rounded-tl-none" />
                                <p className="text-xs text-zinc-500 mt-2">12:34 PM</p>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <div className="max-w-[60%]">
                                <div className="p-4 h-12 w-48 rounded-2xl bg-pink-500 rounded-tr-none" />
                                <p className="text-xs text-zinc-500 mt-2">12:35 PM</p>
                            </div>
                        </div>
                        <div className="flex justify-start">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                                <SafeImage
                                    src="/placeholder.svg?height=40&width=40"
                                    alt="Character"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="max-w-[60%]">
                                <div className="p-4 h-12 w-48 rounded-2xl bg-zinc-800 rounded-tl-none" />
                                <p className="text-xs text-zinc-500 mt-2">12:36 PM</p>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <div className="max-w-[60%]">
                                <div className="p-4 h-12 w-48 rounded-2xl bg-pink-500 rounded-tr-none" />
                                <p className="text-xs text-zinc-500 mt-2">12:37 PM</p>
                            </div>
                        </div>
                        <div className="flex justify-start">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                                <SafeImage
                                    src="/placeholder.svg?height=40&width=40"
                                    alt="Character"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="bg-zinc-800 text-white rounded-tl-none rounded-2xl p-4">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-zinc-400 rounded-full" />
                                    <div className="w-2 h-2 bg-zinc-400 rounded-full" />
                                    <div className="w-2 h-2 bg-zinc-400 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-zinc-800">
                        <div className="flex items-center">
                            <div className="relative p-2 mr-2 text-zinc-400 hover:text-white">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                    />
                                </svg>
                            </div>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="w-full bg-zinc-800 rounded-full py-3 px-4 pr-12"
                                />
                            </div>
                            <button className="p-3 ml-2 rounded-full bg-zinc-700 text-white">
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Paywall Modal */}

        </div>
    );
}