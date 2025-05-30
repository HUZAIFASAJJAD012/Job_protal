const ContactInfo = {
    contact_phone: "+923029677678",
    contact_email: "zararanwar1234321@gmail.com",
    address: "Abbottabad Khyber Pakhtun Khowa",
    facebook: "https://facebook.com",
    twitter: "https://facebook.com",
    linkedin: "https://facebook.com",
    instagram: "https://facebook.com",
    youtube: "https://facebook.com",
}


const teamMembers = [
    {id:1, name: "Alice Smith", title: "Project Manager" },
    {id:2, name: "Bob Johnson", title: "Software Engineer" },
    {id:3, name: "Catherine Lee", title: "UX Designer" },
    {id:4, name: "David Brown", title: "Data Analyst" },
    {id:5, name: "Emily Davis", title: "Marketing Specialist" },
    {id:6, name: "Frank Wilson", title: "Quality Assurance" },
    {id:7, name: "Grace Taylor", title: "Content Strategist" },
    {id:8, name: "Henry Moore", title: "DevOps Engineer" },
   
];

// Dynamically set the server IP based on the environment
// Dynamically set the server IP based on the environment
const server_ip = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';


export { ContactInfo, teamMembers, server_ip}