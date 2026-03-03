export const questionnaire = [
    {
        id: 1,
        partTitle: "Part I: Professional Standards",
        text: "A company's security analyst discovers that a senior executive has been bypassing standard authentication protocols to access sensitive financial data from a personal device. According to the principle of \"Ethical Integrity\" in cybersecurity, what is the most appropriate first course of action?",
        options: [
            "Immediately revoke all access privileges for the executive's personal device.",
            "Document the finding and escalate it via the established internal reporting chain.",
            "Confront the executive directly to request a justification for the bypass.",
            "Anonymously leak the security breach details to the Board of Directors."
        ],
        correctAnswer: 1
    },
    {
        id: 2,
        partTitle: "Part I: Professional Standards",
        text: "Which of the following best describes the concept of 'Defense in Depth' in a multi-layered security architecture?",
        options: [
            "Relying on a single, highly advanced firewall to block all external threats.",
            "Using multiple security controls throughout an IT system to provide redundancy.",
            "Encrypting all data at rest but leaving data in transit unencrypted.",
            "Hardening only the edge routers of a network while leaving internal servers default."
        ],
        correctAnswer: 1
    },
    {
        id: 3,
        partTitle: "Part II: Incident Response",
        text: "During the 'Containment' phase of an incident response lifecycle, what is the primary objective of the security team?",
        options: [
            "Identify the root cause of the initial compromise.",
            "Restore all systems to their original pre-incident state.",
            "Limit the scope and magnitude of an incident to prevent further damage.",
            "Permanently delete the attacker's presence from the network environment."
        ],
        correctAnswer: 2
    },
    {
        id: 4,
        partTitle: "Part II: Incident Response",
        text: "What is the primary benefit of implementing a 'Zero Trust' architecture within a decentralized corporate network?",
        options: [
            "It eliminates the need for strong passwords and multi-factor authentication.",
            "It assumes that everything inside the network is automatically trusted.",
            "It requires strictly verified authentication for every access request, regardless of origin.",
            "It speeds up network performance by reducing the number of encryption checks."
        ],
        correctAnswer: 2
    },
    {
        id: 5,
        partTitle: "Part III: Ethical Hacking",
        text: "What is the purpose of a 'Rule of Engagement' (RoE) document in a professional penetration testing engagement?",
        options: [
            "To detail the technical vulnerabilities found during the scanning phase.",
            "To define the scope, boundaries, and authorized activities of the test.",
            "To provide the client with a list of patches for their identified flaws.",
            "To serve as a marketing agreement between the security firm and the client."
        ],
        correctAnswer: 1
    }
];
