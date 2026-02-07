export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {process.env.NEXT_PUBLIC_SITE_NAME || 'MiniShop'}
            </h3>
            <p className="text-gray-400 text-sm">
              Your trusted online store for quality products.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-400 hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/cart" className="text-gray-400 hover:text-white">
                  Cart
                </a>
              </li>
              <li>
                <a href="/orders" className="text-gray-400 hover:text-white">
                  My Orders
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400 text-sm">
              Email: support@minishop.com
              <br />
              Phone: +880 1234-567890
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()}{' '}
          {process.env.NEXT_PUBLIC_SITE_NAME || 'MiniShop'}. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
