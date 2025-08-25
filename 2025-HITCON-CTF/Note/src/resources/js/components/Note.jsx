import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Label, TextInput, Textarea } from 'flowbite-react';
import { HiPlus, HiSave, HiX, HiCalendar } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';
import normalizeJsonData from '../utils/index';


function Note() {
    const [ready, setReady] = useState(false);
    const [notes, setNotes] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });

    const { token } = useAuth();
    const navigate = useNavigate();

    // Fetch notes from the backend
    const fetchNotes = async () => {
        if (!token) return;
        try {
            const response = await fetch(window.origin + '/api/files', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const jsonData = await response.json();
            const normalizedNotes = normalizeJsonData(jsonData);
            setNotes(normalizedNotes);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    // Effect to check for auth and fetch notes
    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            setReady(false);
            fetchNotes();
            setReady(true)
        }
    }, [token, navigate]);

    const handleCreateNote = () => {
        setIsCreating(true);
        setFormData({ title: '', content: '' });
    };

    const handleSaveNote = async () => {
        if (!token) return;

        const _formData = new FormData();
        _formData.append('file', new Blob([JSON.stringify(formData)], { type: "text/plain" }), 'tmp.txt')
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: _formData,
            });

            if (response.ok) {
                const data = await response.json();
                const newNote = {
                    name: data.path,
                    ...formData
                }
                setNotes([...notes, newNote]);
                handleCancel();
            } else {
                const errorData = await response.json();
                console.error('Failed to save note:', errorData);
                // You could show an error message to the user here
            }
        } catch (error) {
            console.error('Error saving note:', error);
        }
    };

    const handleNoteClick = async (filename) => {

        const response = await fetch(window.origin + `/api/download/${filename}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const disposition = response.headers.get('Content-Disposition');
            let suggestedName = filename;
            if (disposition && disposition.includes("filename=")) {
                suggestedName = disposition.split("filename=")[1].replace(/"/g, "");
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = suggestedName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } else {
            alert('File not found!');
        }

    }

    const handleCancel = () => {
        setIsCreating(false);
        setFormData({ title: '', content: '' });
    };

    if (!token) {
        // Render nothing or a loading spinner while redirecting
        return null;
    }

    if (!ready) {
        return <Loading />
    }

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Notes</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Organize your thoughts and ideas
                        </p>
                    </div>
                    <Button
                        onClick={handleCreateNote}
                        size="lg"
                        className="mt-4 sm:mt-0"
                    >
                        <HiPlus className="mr-2 h-5 w-5" />
                        New Note
                    </Button>
                </div>

                {/* Note Editor Form */}
                {isCreating && (
                    <Card className="mb-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Create New Note
                                </h3>
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="title" value="Title" />
                                </div>
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter note title..."
                                    required
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="content" value="Content" />
                                </div>
                                <Textarea
                                    id="content"
                                    rows={8}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Write your note here..."
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button onClick={handleSaveNote} color="success">
                                    <HiSave className="mr-2 h-4 w-4" />
                                    Create Note
                                </Button>
                                <Button onClick={handleCancel} color="alternative">
                                    <HiX className="mr-2 h-4 w-4" />
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Notes Grid */}
                {notes.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {notes.map((note, index) => (
                            <Card onClick={() => handleNoteClick(note.name)} key={index} className="cursor-pointer hover:shadow-lg transition-shadow duration-200 flex flex-col">
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-3">
                                        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">
                                            {note.title}
                                        </h5>
                                    </div>

                                    <p className="font-normal text-gray-700 dark:text-gray-400 mb-4 line-clamp-4">
                                        {note.content}
                                    </p>
                                </div>

                            </Card>
                        ))}
                    </div>
                ) : (

                    <Card className="text-center py-12">
                        <div className="flex flex-col items-center">
                            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                                <HiPlus className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                                No notes yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Create your first note to get started organizing your thoughts.
                            </p>
                            <Button onClick={handleCreateNote} size="lg">
                                <HiPlus className="mr-2 h-5 w-5" />
                                Create Your First Note
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default Note;
