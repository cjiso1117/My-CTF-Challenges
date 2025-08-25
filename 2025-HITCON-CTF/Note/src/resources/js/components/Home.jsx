import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'flowbite-react';
import { HiOutlineLogin, HiOutlineUserAdd, HiOutlineDocumentText, HiOutlineSparkles } from 'react-icons/hi';

function Home() {
    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full">
                            <HiOutlineSparkles className="w-12 h-12 text-white" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        Welcome to{' '}
                        <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                            Notes App
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                        Organize your thoughts and ideas with our beautiful, simple note-taking application.
                        Create, edit, and manage your notes with ease.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/login">
                            <Button size="lg" className="sm:w-auto">
                                <HiOutlineLogin className="mr-2 h-5 w-5" />
                                Sign In
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button color="light" size="lg" className="sm:w-auto">
                                <HiOutlineUserAdd className="mr-2 h-5 w-5" />
                                Create Account
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <Card className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <HiOutlineDocumentText className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                            </div>
                        </div>
                        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                            Easy Note Taking
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            Create and organize your notes quickly with our intuitive interface.
                            Write, edit, and manage your thoughts effortlessly.
                        </p>
                    </Card>

                    <Card className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                <HiOutlineSparkles className="w-8 h-8 text-green-600 dark:text-green-300" />
                            </div>
                        </div>
                        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                            Beautiful Design
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            Enjoy a clean, modern interface that's both beautiful and functional.
                            Dark mode support included for comfortable writing.
                        </p>
                    </Card>

                    <Card className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <HiOutlineLogin className="w-8 h-8 text-purple-600 dark:text-purple-300" />
                            </div>
                        </div>
                        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                            Secure & Fast
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            Your notes are secure and accessible anytime. Built with modern technology
                            for optimal performance and reliability.
                        </p>
                    </Card>
                </div>

                {/* CTA Section */}
                <Card className="text-center bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
                    <h5 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Ready to get started?
                    </h5>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Join thousands of users who trust Notes App for their daily note-taking needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/register">
                            <Button size="lg">
                                Get Started Free
                            </Button>
                        </Link>
                        <Link to="/note">
                            <Button color="alternative" size="lg">
                                View Demo
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default Home;
