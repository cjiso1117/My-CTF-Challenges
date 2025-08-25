import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Label, TextInput, Alert, Spinner } from 'flowbite-react';
import { HiUser, HiMail, HiLockClosed, HiInformationCircle } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors) {
            setErrors(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors(null);

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                login(data.user, data.token);
                navigate('/note');
            } else {
                setErrors(data.errors || { message: [data.message] });
            }
        } catch (error) {
            setErrors({ message: ['An unexpected error occurred. Please try again.'] });
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Create account
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Join us today and start taking notes
                    </p>
                </div>

                {errors && errors.message && (
                    <Alert color="failure" icon={HiInformationCircle} className="mb-4">
                        <span className="font-medium">Registration failed!</span> {errors.message[0]}
                    </Alert>
                )}

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="username" value="Username" color={errors?.username ? 'failure' : 'default'} />
                        </div>
                        <TextInput
                            id="username"
                            name="username"
                            type="text"
                            icon={HiUser}
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange}
                            color={errors?.username ? 'failure' : 'default'}
                            required
                            shadow
                        />
                        {errors?.username && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                {errors.username[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password" value="Password" color={errors?.password ? 'failure' : 'default'} />
                        </div>
                        <TextInput
                            id="password"
                            name="password"
                            type="password"
                            icon={HiLockClosed}
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            color={errors?.password ? 'failure' : 'default'}
                            required
                            shadow
                        />
                        {errors?.password && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                {errors.password[0]}
                            </p>
                        )}
                    </div>


                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Spinner size="sm" />
                                <span className="pl-3">Creating account...</span>
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </Button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
}

export default Register;
