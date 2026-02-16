import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    "https://dmgxypbvvnuiszoqpgja.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtZ3h5cGJ2dm51aXN6b3FwZ2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTk2MTgsImV4cCI6MjA4NjY3NTYxOH0.1TES3VOWUwIJGd2z1UN-XpTMzJJfo9Vxn9YBguhNv90"
);

const users = [
    { email: "test1@invitacon.dev", password: "Test1234!", name: "Ana García" },
    { email: "test2@invitacon.dev", password: "Test1234!", name: "Luis Martínez" },
    { email: "test3@invitacon.dev", password: "Test1234!", name: "Miren Etxebarria" },
];

for (const user of users) {
    const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
            data: { full_name: user.name },
        },
    });

    if (error) {
        console.log(`❌ ${user.email}: ${error.message}`);
    } else {
        console.log(`✅ ${user.email} created (id: ${data.user?.id})`);
    }
}
