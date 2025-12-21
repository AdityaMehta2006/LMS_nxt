"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Typography,
    Button,
    Container,
    Grid
} from "@mui/material";
import { ArrowBack, GitHub, LinkedIn } from "@mui/icons-material";

const TeamMember = ({ member }) => {
    return (
        <Box
            className="team-card"
            sx={{
                position: "relative",
                "&:hover .glow-effect": {
                    opacity: 0.15
                },
                "&:hover .card-content": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.25)"
                }
            }}
        >
            {/* Glow Effect on Hover */}
            <Box
                className="glow-effect"
                sx={{
                    position: "absolute",
                    inset: -2,
                    background: "linear-gradient(45deg, #0b2ea1, #3b82f6)",
                    borderRadius: 4,
                    opacity: 0,
                    filter: "blur(8px)",
                    transition: "opacity 0.4s ease"
                }}
            />

            {/* Card Content */}
            <Box
                className="card-content"
                sx={{
                    position: "relative",
                    bgcolor: "white",
                    borderRadius: 4,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)",
                    overflow: "hidden",
                    transition: "all 0.4s ease",
                    p: 4,
                    textAlign: "center"
                }}
            >
                {/* Member Info */}
                <Typography
                    variant="h5"
                    sx={{
                        color: "#0f172a",
                        mb: 1,
                        fontWeight: 700,
                        fontSize: "1.25rem"
                    }}
                >
                    {member.name}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: "#64748b",
                        mb: 0.5,
                        fontSize: "0.9rem"
                    }}
                >
                    {member.regNo}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: "#64748b",
                        mb: 1,
                        fontSize: "0.9rem"
                    }}
                >
                    {member.dept}
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        color: "#64748b",
                        mb: 3,
                        fontSize: "1rem"
                    }}
                >
                    {member.role}
                </Typography>

                {/* Divider */}
                <Box
                    sx={{
                        width: 60,
                        height: 3,
                        background: "linear-gradient(90deg, #0b2ea1, #3b82f6)",
                        mb: 3,
                        mx: "auto",
                        borderRadius: 2
                    }}
                />

                {/* Connect Section */}
                <Typography
                    variant="body2"
                    sx={{
                        color: "#94a3b8",
                        mb: 2,
                        fontWeight: 500
                    }}
                >
                    Connect with me
                </Typography>

                {/* Social Links */}
                <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
                    <Button
                        href={member.github || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        startIcon={<GitHub sx={{ fontSize: 18 }} />}
                        sx={{
                            px: 3,
                            py: 1.2,
                            bgcolor: "#f8fafc",
                            borderColor: "#e2e8f0",
                            color: "#64748b",
                            borderRadius: 3,
                            fontSize: "0.85rem",
                            fontWeight: 500,
                            "&:hover": {
                                bgcolor: "#0f172a",
                                borderColor: "#0f172a",
                                color: "white",
                                transform: "translateY(-1px)"
                            },
                            transition: "all 0.3s ease"
                        }}
                    >
                        GitHub
                    </Button>

                    <Button
                        href={member.linkedin || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        startIcon={<LinkedIn sx={{ fontSize: 18 }} />}
                        sx={{
                            px: 3,
                            py: 1.2,
                            bgcolor: "#f8fafc",
                            borderColor: "#e2e8f0",
                            color: "#64748b",
                            borderRadius: 3,
                            fontSize: "0.85rem",
                            fontWeight: 500,
                            "&:hover": {
                                bgcolor: "#0b2ea1",
                                borderColor: "#0b2ea1",
                                color: "white",
                                transform: "translateY(-1px)"
                            },
                            transition: "all 0.3s ease"
                        }}
                    >
                        LinkedIn
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

const CreditsPage = () => {
    const router = useRouter();
    //SIX SEVEN
    const teamMembers = [
        {
            id: 1,
            name: 'K Suraj Das',
            regNo: '2440224',
            dept: 'Department of Computer Science',
            role: 'Developer',
            github: "https://github.com/suraj211223",
            linkedin: "https://www.linkedin.com/in/suraj-das-8b2896232"
        },
        {
            id: 2,
            name: 'Rithesh K R',
            regNo: '2440233',
            dept: 'Department of Computer Science',
            role: 'Developer',
            github: 'https://github.com/Rithesh077',
            linkedin: 'https://www.linkedin.com/in/rithesh-k-r-284315325'
        },
        {
            id: 3,
            name: 'Aditya Mehta',
            regNo: '2440204',
            dept: 'Department of Computer Science',
            role: 'Developer',
            github: 'https://github.com/AdityaMehta2006',
            linkedin: 'https://www.linkedin.com/in/aditya-mehta-155a40315/'
        }
    ];

    return (
        <Box sx={{ minHeight: "100vh", background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f8fafc 100%)" }}>
            {/* Decorative Background Elements */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                    pointerEvents: "none"
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 384,
                        height: 384,
                        bgcolor: "#dbeafe",
                        borderRadius: "50%",
                        filter: "blur(64px)",
                        opacity: 0.3,
                        transform: "translate(50%, -50%)"
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: 384,
                        height: 384,
                        bgcolor: "#e0e7ff",
                        borderRadius: "50%",
                        filter: "blur(64px)",
                        opacity: 0.3,
                        transform: "translate(-50%, 50%)"
                    }}
                />
            </Box>

            <Container maxWidth="lg" sx={{ position: "relative", py: 4 }}>
                {/* Back Button */}
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => router.push("/login")}
                    sx={{
                        mb: 2,
                        color: "#64748b",
                        "&:hover": {
                            bgcolor: "#f1f5f9"
                        }
                    }}
                >
                    Back to Login
                </Button>

                {/* Thank You Section */}
                <Box sx={{ textAlign: "center", mb: 10, mt: 4 }}>

                    <Typography
                        variant="h3"
                        sx={{
                            color: "#0f172a",
                            mb: 2,
                            fontWeight: "bold",
                            maxWidth: "48rem",
                            mx: "auto"
                        }}
                    >
                        Credits & Acknowledgments
                    </Typography>

                    <Box sx={{ maxWidth: "42rem", mx: "auto" }}>
                        <Typography
                            variant="body1"
                            sx={{
                                color: "#64748b",
                                lineHeight: 1.5,
                                fontWeight: 400,
                                fontSize: "1rem"
                            }}
                        >
                            We would like to extend our heartfelt gratitude to <Box component="span" sx={{ fontWeight: "bold" }}>Dr Ashok Immanuel</Box> sir for his guidance and support in making this website a reality.
                        </Typography>
                    </Box>
                </Box>

                {/* Meet The Team Section */}
                <Box sx={{ textAlign: "center", mb: 6 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            color: "#0f172a",
                            fontWeight: "bold",
                            letterSpacing: "0.02em",
                            position: "relative",
                            display: "inline-block",
                            "&::after": {
                                content: '""',
                                position: "absolute",
                                bottom: -8,
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: 80,
                                height: 4,
                                background: "linear-gradient(90deg, #0b2ea1, #3b82f6)",
                                borderRadius: 2
                            }
                        }}
                    >
                        Meet The Team
                    </Typography>
                </Box>

                {/* Team Members Grid */}
                <Grid container spacing={4} sx={{ mb: 5, justifyContent: "center" }}>
                    {teamMembers.map((member) => (
                        <Grid item xs={12} sm={6} md={4} key={member.id}>
                            <TeamMember member={member} />
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Design Philosophy Section */}
            <Box sx={{ py: 8, bgcolor: "white", position: "relative" }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", mb: 6 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                color: "#0f172a",
                                fontWeight: "bold",
                                letterSpacing: "0.02em",
                                position: "relative",
                                display: "inline-block",
                                "&::after": {
                                    content: '""',
                                    position: "absolute",
                                    bottom: -8,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: 80,
                                    height: 4,
                                    background: "linear-gradient(90deg, #ec4899, #8b5cf6)",
                                    borderRadius: 2
                                }
                            }}
                        >
                            Our Design Philosophy
                        </Typography>
                    </Box>

                    <Grid container spacing={4} justifyContent="center">
                        {/* Card 1: Premium Experience */}
                        <Grid item xs={12} md={4}>
                            <Box sx={{
                                p: 4,
                                height: '100%',
                                borderRadius: 4,
                                bgcolor: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                transition: 'transform 0.3s ease',
                                '&:hover': { transform: 'translateY(-5px)', borderColor: '#3b82f6' }
                            }}>
                                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                                    </Box>
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center', color: '#0f172a' }}>
                                    Premium Experience
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center' }}>
                                    We prioritize a sense of quality and modernity, moving beyond basic functionality to deliver a state-of-the-art interface that feels polished and professional.
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Card 2: Dynamic Design */}
                        <Grid item xs={12} md={4}>
                            <Box sx={{
                                p: 4,
                                height: '100%',
                                borderRadius: 4,
                                bgcolor: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                transition: 'transform 0.3s ease',
                                '&:hover': { transform: 'translateY(-5px)', borderColor: '#8b5cf6' }
                            }}>
                                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m16 12-4-4-4 4" /><path d="M12 16V8" /></svg>
                                    </Box>
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center', color: '#0f172a' }}>
                                    Dynamic Interactions
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center' }}>
                                    Interfaces should feel alive. We use smooth transitions, hover effects, and micro-animations to create an engaging responsiveness that encourages interaction.
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Card 3: Visual Excellence */}
                        <Grid item xs={12} md={4}>
                            <Box sx={{
                                p: 4,
                                height: '100%',
                                borderRadius: 4,
                                bgcolor: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                transition: 'transform 0.3s ease',
                                '&:hover': { transform: 'translateY(-5px)', borderColor: '#ec4899' }
                            }}>
                                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>
                                    </Box>
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center', color: '#0f172a' }}>
                                    Visual Excellence
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center' }}>
                                    Aesthetics matter. We curate harmonious color palettes, modern typography, and clean layouts to ensure the platform is not just useful, but beautiful to use.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Blue Footer Section */}
            <Box
                sx={{
                    position: "relative",
                    background: "linear-gradient(135deg, #0b2ea1 0%, #0a267d 100%)",
                    py: 3,
                    px: 2
                }}
            >
                {/* Decorative Pattern */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.1,
                        backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                        backgroundSize: "40px 40px"
                    }}
                />

                <Box sx={{ position: "relative", textAlign: "center" }}>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "rgba(255, 255, 255, 0.95)",
                            fontSize: "0.9rem"
                        }}
                    >
                        © {new Date().getFullYear()} All Rights Reserved
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default CreditsPage;
