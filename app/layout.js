
import './globals.css'; 
export const metadata = {
  title: 'My Portfolio',
  description: 'A space-themed portfolio built with Next.js',
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;