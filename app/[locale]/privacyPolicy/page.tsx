import Head from 'next/head';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Head>
                <title>Privacy Policy</title>
                <meta name="description" content="Privacy Policy" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className="bg-blue-600 text-white py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold">Privacy Policy</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <section className="bg-white shadow-md rounded-lg p-8">
                    <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
                    <p className="text-gray-700 mb-4">
                        Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                    </p>
                    <h3 className="text-xl font-medium mb-2">1. Information We Collect</h3>
                    <p className="text-gray-700 mb-4">
                        We may collect personal information such as your name, email address, and other details you provide when you interact with our website.
                    </p>
                    <h3 className="text-xl font-medium mb-2">2. How We Use Your Information</h3>
                    <p className="text-gray-700 mb-4">
                        We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to comply with legal obligations.
                    </p>
                    <h3 className="text-xl font-medium mb-2">3. Sharing Your Information</h3>
                    <p className="text-gray-700 mb-4">
                        We do not sell or share your personal information with third parties except as necessary to provide our services or as required by law.
                    </p>
                    <h3 className="text-xl font-medium mb-2">4. Data Security</h3>
                    <p className="text-gray-700 mb-4">
                        We implement reasonable security measures to protect your information, but no method of transmission over the internet is completely secure.
                    </p>
                    <h3 className="text-xl font-medium mb-2">5. Your Rights</h3>
                    <p className="text-gray-700 mb-4">
                        You may have the right to access, update, or delete your personal information. Please contact us for assistance with these requests.
                    </p>
                    <h3 className="text-xl font-medium mb-2">6. Changes to Privacy Policy</h3>
                    <p className="text-gray-700 mb-4">
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
                    </p>
                    <p className="text-gray-600 mt-6">
                        For any questions about this Privacy Policy, please contact us at support@example.com.
                    </p>
                </section>
            </main>

            <footer className="bg-gray-800 text-white py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>© 2025 Your Company. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}