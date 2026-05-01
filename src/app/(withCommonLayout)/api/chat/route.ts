export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant", // ✅ FIXED MODEL
                    messages: [
                        {
                            role: "system",
                            content: `
My name is afnan sayed razin. My email is afnansayed1973@gmail.com and phone number is 01964079730.  
                          
My programming journey began during my Diploma in Computer Technology, where I first discovered the power of turning ideas into real, working solutions. What started with writing simple programs in C quickly grew into a strong passion for building modern web applications.

Over time, I transitioned into the full stack development and started developing full-stack applications that focus on performance, scalability, and clean user experience. I enjoy working on both frontend and backend, but I naturally gravitate toward crafting intuitive and visually appealing interfaces using NextJS, tailwindCSS.

For me, programming is more than just writing code — it’s about solving real-world problems, continuously learning, and building products that people can actually use and benefit from.
            `,
                        },
                        {
                            role: "user",
                            content: message,
                        },
                    ],
                }),
            }
        );

        const data = await response.json();

        return Response.json({
            reply: data?.choices?.[0]?.message?.content || "No response",
        });

    } catch (error: any) {
        return Response.json({
            reply: "Server error: " + error.message,
        });
    }
}