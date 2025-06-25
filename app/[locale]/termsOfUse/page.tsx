import Head from 'next/head';

export default function TermsOfUse() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Head>
                <title>Terms of Use</title>
                <meta name="description" content="Terms of Use" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className="bg-blue-600 text-white py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold">Terms of Use</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <section className="bg-white shadow-md rounded-lg p-8">
                    <h2 className="text-2xl font-semibold mb-4">Terms of Use</h2>
                    <p className="text-gray-700 mb-4">
                        Welcome to our website. By accessing or using this website, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use our website.
                    </p>
                    <h3 className="text-xl font-medium mb-2">1. Use of the Website</h3>
                    <p className="text-gray-700 mb-4">
                        You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of, or restrict or inhibit the use and enjoyment of this website by, any third party.
                    </p>
                    <h3 className="text-xl font-medium mb-2">2. Intellectual Property</h3>
                    <p className="text-gray-700 mb-4">
                        All content on this website, including text, graphics, logos, and software, is the property of the website owner or its content suppliers and is protected by copyright laws.
                    </p>
                    <h3 className="text-xl font-medium mb-2">3. Limitation of Liability</h3>
                    <p className="text-gray-700 mb-4">
                        The website is provided "as is" without any warranties. We are not liable for any damages arising from the use of this website.
                    </p>
                    <h3 className="text-xl font-medium mb-2">4. Changes to Terms</h3>
                    <p className="text-gray-700 mb-4">
                        We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting to the website.
                    </p>
                    <p className="text-gray-600 mt-6">
                        For any questions about these Terms of Use, please contact us at support@example.com.
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