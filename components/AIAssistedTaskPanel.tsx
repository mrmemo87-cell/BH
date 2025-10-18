import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { FullUserTask } from '../types';

interface AIAssistedTaskPanelProps {
    task: FullUserTask;
    onComplete: (taskId: string) => void;
}

const AIAssistedTaskPanel: React.FC<AIAssistedTaskPanelProps> = ({ task, onComplete }) => {
    const [question, setQuestion] = useState<string | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' | 'info' } | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const generateQuestion = useCallback(async () => {
        setLoading(true);
        setFeedback(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const subject = task.template.title.includes('Science') ? 'science' : 'math';
            const prompt = `Generate a single, medium-difficulty ${subject} question suitable for a trivia game. The question should be answerable in a few words. Do not include the answer in your response.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setQuestion(response.text);

        } catch (error) {
            console.error("Error generating question:", error);
            setFeedback({ message: 'Error fetching question from AI. Please try again later.', type: 'incorrect' });
        } finally {
            setLoading(false);
        }
    }, [task.template.title]);

    useEffect(() => {
        generateQuestion();
    }, [generateQuestion]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userAnswer.trim()) return;

        setIsSubmitting(true);
        setFeedback(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Here is a question: "${question}". The user answered: "${userAnswer}". Is this answer correct? Please consider variations in phrasing. Respond with only the word "Correct" or "Incorrect".`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const result = response.text.trim().toLowerCase();

            if (result.includes('correct')) {
                setFeedback({ message: 'Correct! Task complete.', type: 'correct' });
                setTimeout(() => {
                    onComplete(task.id);
                }, 1500);
            } else {
                setFeedback({ message: 'Incorrect. Please try again.', type: 'incorrect' });
            }
        } catch (error) {
            console.error("Error verifying answer:", error);
            setFeedback({ message: 'Could not verify your answer. Please try again.', type: 'incorrect' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 text-center text-gray-400">
                <svg className="animate-spin h-8 w-8 mx-auto mb-3 text-[var(--neon-cyan)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating question...
            </div>
        );
    }
    
    return (
        <div className="p-6 bg-[var(--glass)] rounded-lg border border-[var(--glass-border)]">
            <h4 className="font-bold text-gray-300 mb-2">AI Challenge:</h4>
            <p className="text-lg text-white mb-4">{question}</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full bg-[var(--bg)] border border-[var(--glass-border)] rounded-lg py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--neon-cyan)] mb-4"
                />
                <button
                    type="submit"
                    disabled={isSubmitting || feedback?.type === 'correct'}
                    className="w-full font-bold py-3 px-6 rounded-lg text-black transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 btn-neon hover:scale-105 disabled:opacity-50 disabled:cursor-wait"
                >
                    {isSubmitting ? 'Verifying...' : 'Submit Answer'}
                </button>
            </form>
            {feedback && (
                 <div className={`mt-4 text-center p-2 rounded-lg text-sm ${
                    feedback.type === 'correct' ? 'bg-green-500/20 text-green-300' :
                    feedback.type === 'incorrect' ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-300'
                 }`}>
                    {feedback.message}
                 </div>
            )}
        </div>
    );
};

export default AIAssistedTaskPanel;
