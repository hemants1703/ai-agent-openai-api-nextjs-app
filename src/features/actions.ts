"use server";

export async function submitPrompt(prevState: any, formData: FormData) {
    const prompt = formData.get('prompt') as string;

    if (!prompt) {
        return { error: 'Prompt is required' };
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/agent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            return { error: 'Failed to get response' };
        }

        const data = await response.json();
        return { success: true, data: data.aiAgentFinalOutput };
    } catch (error) {
        return { error: 'Something went wrong' };
    }
}