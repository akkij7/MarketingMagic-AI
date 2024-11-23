(async function() {
    const responseElement = document.getElementById('response');
    const contentElement = document.getElementById('content'); // New element to insert content

    // formData is already defined in the global scope in the HTML
    const { brandName, whatYouSell, targetAudience, campaignGoals, platforms } = formData;

    // Craft the prompt
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const userPrompt = `
Exactly do what is asked, especially with output.

Act as a social media strategist for ${brandName}, a company that sells ${whatYouSell}.
The target audience is ${targetAudience}, with campaign goals of ${campaignGoals}, focusing on these platforms: ${platforms}.

Generate a 3-day content calendar, with two posts maximum for each day that includes:
- A creative post caption tailored to the platform. Include hashtags.
- Product photography suggestions.

Format the output as a markdown table. Today’s date is ${formattedDate}, and posts should start from tomorrow in the format "DD MMM (HH:MM AM/PM)".
Please only give a single table and no notes or anything similar, just what we asked, no additional information. NO PLACEHOLDERS.

Example format:
| Date | Platform | Post Caption | Image Suggestion |
`;

    // Retry logic with a maximum of 5 attempts
    let attempts = 0;
    const maxRetries = 5;
    let success = false;

    async function generateContent() {
        try {
            // Check if AI Prompt API is available
            if (!('ai' in window) || !ai.languageModel) {
                responseElement.innerText = "AI Prompt API is not available in your browser. Please use the latest version of Chrome with the necessary flags enabled.";
                return;
            }

            const { available } = await ai.languageModel.capabilities();

            if (available !== "no") {
                // Create a session
                const session = await ai.languageModel.create();

                // Send the prompt
                const result = await session.prompt(userPrompt);

                if (!result) {
                    throw new Error('No response from AI Prompt API.');
                }

                // Display the result
                const markdownContent = result;
                const htmlContent = marked.parse(markdownContent);
                const sanitizedHtml = DOMPurify.sanitize(htmlContent);

                // Insert the content into the content element
                contentElement.innerHTML = sanitizedHtml;

                success = true;

                // Dispatch the 'contentLoaded' event
                const event = new Event('contentLoaded');
                responseElement.dispatchEvent(event);
            } else {
                responseElement.innerText = "AI Prompt API is not available. Please ensure you're using a compatible version of Chrome with the proper flags enabled.";
            }
        } catch (error) {
            console.error("Error:", error);
            attempts++;
            if (attempts < maxRetries) {
                console.log(`Retrying... (${attempts}/${maxRetries})`);
                await generateContent();
            } else {
                responseElement.innerText = "An error occurred while generating content. Please try again later.";
            }
        }
    }

    // Start the content generation with retry logic
    generateContent();

})();
