
import { NextResponse, type NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, title, subject } = body;

        if (!name || !email || !title || !subject) {
            return NextResponse.json(
                {
                    success: false,
                    message: "All fields are required.",
                },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email address.",
                },
                { status: 400 }
            );
        }

        const escapeHtml = (value: string) =>
            value
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safeTitle = escapeHtml(title);
        const safeMessage = escapeHtml(subject);


        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Yatra Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.CONTACT_RECEIVER,
            replyTo: email,
            subject: `New Yatra Message from ${name} - ${title}`,

            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>

                <body style="
                    margin: 0;
                    padding: 0;
                    background-color: #0f172a;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                    Roboto, Helvetica, Arial, sans-serif;
                ">

                    <table
                        role="presentation"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        style=" background-color: #0f172a;  padding: 30px 10px;"
                    >
                        <tr>
                            <td align="center">

                                <table
                                    role="presentation"
                                    width="100%"
                                    style="max-width: 600px;  background-color: #1e293b;  border-radius: 12px;  border: 1px solid #334155;  overflow: hidden; "
                                >

                        
                                    <tr>
                                        <td style="
                                            background-color: #0f172a;
                                            padding: 24px 30px;
                                            border-bottom: 1px solid #334155;
                                        ">

                                            <span style="
                                                font-family: monospace;
                                                font-size: 12px;
                                                color: #10b981;
                                                text-transform: uppercase;
                                                letter-spacing: 1.5px;
                                                font-weight: 600;
                                            ">
                                                Yatra Notification
                                            </span>

                                            <h1 style="
                                                margin: 6px 0 0 0;
                                                color: #ffffff;
                                                font-size: 20px;
                                                font-weight: 700;
                                            ">
                                                New Contact Submission
                                            </h1>

                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding: 30px;">
                                            <table
                                                role="presentation"
                                                width="100%"
                                                style=" margin-bottom: 24px; background-color: #0f172a; border-radius: 8px; border: 1px solid #334155;"
                                            >
                                                <tr>
                                                    <td style="padding: 16px 16px 8px 16px;">

                                                        <span style="
                                                            color: #64748b;
                                                            font-size: 11px;
                                                            text-transform: uppercase;
                                                            font-weight: 700;
                                                            letter-spacing: 1px;
                                                        ">
                                                        from
                                                        </span>

                                                        <div style="
                                                            color: #f8fafc;
                                                            font-size: 15px;
                                                            font-weight: 600;
                                                            margin-top: 2px;
                                                        ">
                                                            ${safeName}
                                                        </div>

                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding: 8px 16px;">

                                                        <span style="
                                                            color: #64748b;
                                                            font-size: 11px;
                                                            text-transform: uppercase;
                                                            font-weight: 700;
                                                            letter-spacing: 1px;
                                                        ">
                                                           email address
                                                        </span>

                                                        <div style="
                                                            color: #10b981;
                                                            font-size: 15px;
                                                            font-weight: 500;
                                                            margin-top: 2px;
                                                        ">
                                                            <a
                                                                href="mailto:${safeEmail}"
                                                                style="
                                                                    color: #10b981;
                                                                    text-decoration: none;
                                                                "
                                                            >
                                                                ${safeEmail}
                                                            </a>
                                                        </div>

                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding: 8px 16px 16px 16px;">

                                                        <span style="
                                                            color: #64748b;
                                                            font-size: 11px;
                                                            text-transform: uppercase;
                                                            font-weight: 700;
                                                            letter-spacing: 1px;
                                                        ">
                                                            title
                                                        </span>

                                                        <div style="
                                                            color: #f8fafc;
                                                            font-size: 15px;
                                                            font-weight: 500;
                                                            margin-top: 2px;
                                                        ">
                                                            ${safeTitle}
                                                        </div>

                                                    </td>
                                                </tr>
                                            </table>

                                            <div style="margin-bottom: 8px;">

                                                <span style="
                                                    color: #64748b;
                                                    font-size: 11px;
                                                    text-transform: uppercase;
                                                    font-weight: 700;
                                                    letter-spacing: 1px;
                                                ">
                                                    subject
                                                </span>

                                            </div>

                                            <div style="
                                                background-color: #0f172a;
                                                border-radius: 4px;
                                                padding: 18px;
                                                color: #cbd5e1;
                                                font-size: 14px;
                                                line-height: 1.6;
                                                white-space: pre-wrap;
                                            ">
                                                ${safeMessage}
                                            </div>

                                            <table  role="presentation"  width="100%"  style="margin-top: 28px;"
                                            >
                                                <tr>
                                                    <td align="center">
                                                        <a href="mailto:${safeEmail}" style="
                                                                display: inline-block;
                                                                background-color: #10b981;
                                                                color: #022c22;
                                                                font-weight: 700;
                                                                font-size: 14px;
                                                                text-decoration: none;
                                                                padding: 12px 28px;
                                                                border-radius: 6px;
                                                            "
                                                        >
                                                            Reply Directly to ${safeName}
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>

                </body>
                </html>
            `,
        });

        return NextResponse.json({
            success: true,
            message: "Message sent successfully.",
        });
    } catch (error) {
        console.error("Contact form error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong.",
            },
            { status: 500 }
        );
    }
}

