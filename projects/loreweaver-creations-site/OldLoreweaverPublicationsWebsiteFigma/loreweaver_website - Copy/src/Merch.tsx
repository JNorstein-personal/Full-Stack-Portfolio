import { PageNavDropdown } from "./components/PageNavDropdown";
import { ShoppingBag, Shirt, Watch, Gamepad2, Star, TrendingUp, Package, Truck, BookOpen } from "lucide-react";

export default function Merch() {
  // Define page sections for jump-to navigation
  const pageSections = [
    { label: "Shop All", id: "shop-all" },
    { label: "Apparel", id: "apparel" },
    { label: "Accessories", id: "accessories" },
    { label: "Games", id: "games" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 flex-1">
      {/* Page Navigation Dropdown - Between header and content on mobile, floating on desktop */}
      <div className="mb-6 flex justify-end lg:mb-0 lg:absolute lg:top-0 lg:right-0 lg:z-10">
        <PageNavDropdown
  items={pageSections}
  onSelect={(id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }}
/>
      </div>

      {/* Full Width Content */}
      <div className="space-y-12">
        {/* Shop All Section */}
        <section id="shop-all">
          <h1 className="mb-6">LOREWEAVER Merchandise</h1>
          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              Show your love for LOREWEAVER with our official merchandise! From apparel and accessories to games and collectibles, find the perfect items to celebrate your favorite stories and characters.
            </p>
          </div>

          {/* Shop Features */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 text-center">
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-2">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="text-sm mb-1">Free Shipping</h4>
              <p className="text-xs text-gray-600">On orders over $50</p>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 text-center">
              <div className="bg-green-100 p-3 rounded-lg inline-block mb-2">
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="text-sm mb-1">Quality Guarantee</h4>
              <p className="text-xs text-gray-600">Premium materials</p>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 text-center">
              <div className="bg-purple-100 p-3 rounded-lg inline-block mb-2">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="text-sm mb-1">Easy Returns</h4>
              <p className="text-xs text-gray-600">30-day policy</p>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 text-center">
              <div className="bg-orange-100 p-3 rounded-lg inline-block mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <h4 className="text-sm mb-1">New Arrivals</h4>
              <p className="text-xs text-gray-600">Updated weekly</p>
            </div>
          </div>

          {/* Featured Products */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md border border-purple-200 p-8 mb-8">
            <h2 className="mb-6">Featured Products</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Limited Edition Art Print", category: "Accessories", price: "$24.99" },
                { name: "LOREWEAVER Logo T-Shirt", category: "Apparel", price: "$29.99" },
                { name: "World Map Poster", category: "Accessories", price: "$19.99" },
              ].map((product, index) => (
                <div key={index} className="bg-white rounded-lg border border-purple-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gray-200 border-b-2 border-gray-300 h-48 flex items-center justify-center">
                    <div className="bg-purple-600 rounded-full p-4">
                      <ShoppingBag className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">Featured</span>
                    </div>
                    <h3 className="mb-1">{product.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600">{product.price}</span>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Products Grid */}
          <h2 className="mb-6">All Products</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Classic Logo Hoodie", category: "Apparel", price: "$49.99", tag: "Best Seller" },
              { name: "Character Pin Set", category: "Accessories", price: "$15.99", tag: null },
              { name: "Realm Quest Board Game", category: "Games", price: "$44.99", tag: "New" },
              { name: "Book-Inspired Tote Bag", category: "Accessories", price: "$18.99", tag: null },
              { name: "Fantasy Map Blanket", category: "Apparel", price: "$39.99", tag: "Best Seller" },
              { name: "Enamel Mug Set", category: "Accessories", price: "$22.99", tag: null },
              { name: "Character T-Shirt", category: "Apparel", price: "$27.99", tag: null },
              { name: "Lore Trivia Card Game", category: "Games", price: "$19.99", tag: "New" },
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gray-200 border-b-2 border-gray-300 h-40 flex items-center justify-center relative">
                  {product.tag && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs">
                      {product.tag}
                    </div>
                  )}
                  <div className="bg-gray-400 rounded-full p-3">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-sm mb-1">{product.name}</h4>
                  <p className="text-xs text-gray-600 mb-3">{product.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600">{product.price}</span>
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Load More Products
            </button>
          </div>
        </section>

        {/* Apparel Section */}
        <section id="apparel">
          <h2 className="mb-6">Apparel</h2>
          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              Wear your LOREWEAVER pride with our collection of high-quality apparel. From comfortable t-shirts to cozy hoodies, our clothing line features original designs inspired by your favorite stories.
            </p>
          </div>

          {/* Size Guide */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Shirt className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2">Size Guide & Care Instructions</h3>
                <p className="text-sm text-gray-700 mb-3">
                  All apparel is made from premium, pre-shrunk materials. Check our size guide for the perfect fit, and follow care instructions to keep your items looking great.
                </p>
                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                  View Size Chart →
                </a>
              </div>
            </div>
          </div>

          {/* Apparel Categories */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="mb-4">T-Shirts</h3>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Classic Logo Tee</span>
                  <span className="text-blue-600">$27.99</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Character Design Tee</span>
                  <span className="text-blue-600">$29.99</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Quote T-Shirt</span>
                  <span className="text-blue-600">$27.99</span>
                </div>
              </div>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                Shop T-Shirts →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="mb-4">Hoodies & Sweatshirts</h3>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Classic Logo Hoodie</span>
                  <span className="text-blue-600">$49.99</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Zip-Up Hoodie</span>
                  <span className="text-blue-600">$54.99</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Crewneck Sweatshirt</span>
                  <span className="text-blue-600">$44.99</span>
                </div>
              </div>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                Shop Hoodies →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="mb-4">Other Apparel</h3>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Long Sleeve Tee</span>
                  <span className="text-blue-600">$32.99</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Tank Top</span>
                  <span className="text-blue-600">$24.99</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Baseball Cap</span>
                  <span className="text-blue-600">$22.99</span>
                </div>
              </div>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                Shop More →
              </a>
            </div>
          </div>

          {/* Apparel Products */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "LOREWEAVER Logo Hoodie", sizes: "S-XXL", price: "$49.99", colors: "5 colors" },
              { name: "Character Art T-Shirt", sizes: "S-XXL", price: "$29.99", colors: "3 colors" },
              { name: "Realm Map Sweatshirt", sizes: "S-XXL", price: "$44.99", colors: "4 colors" },
              { name: "Quote Long Sleeve", sizes: "S-XXL", price: "$32.99", colors: "2 colors" },
              { name: "Vintage Logo Tee", sizes: "S-XXL", price: "$27.99", colors: "6 colors" },
              { name: "Zip-Up Hoodie", sizes: "S-XXL", price: "$54.99", colors: "3 colors" },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gray-200 border-b-2 border-gray-300 h-48 flex items-center justify-center">
                  <div className="bg-blue-600 rounded-full p-4">
                    <Shirt className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-sm mb-1">{item.name}</h4>
                  <p className="text-xs text-gray-600 mb-1">{item.sizes} • {item.colors}</p>
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">(42)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600">{item.price}</span>
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors">
                      Select Options
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Accessories Section */}
        <section id="accessories">
          <h2 className="mb-6">Accessories</h2>
          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              Complete your collection with our range of accessories. From art prints and posters to pins, mugs, and more, these items make perfect additions to any fan's collection or thoughtful gifts for fellow LOREWEAVER enthusiasts.
            </p>
          </div>

          {/* Accessory Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 p-3 rounded-lg inline-block mb-3">
                <Watch className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="mb-2">Collectibles</h3>
              <p className="text-sm text-gray-700 mb-3">
                Pins, patches, stickers, and more
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                Shop Now →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
              <div className="bg-green-100 p-3 rounded-lg inline-block mb-3">
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="mb-2">Bags & Totes</h3>
              <p className="text-sm text-gray-700 mb-3">
                Tote bags, backpacks, and pouches
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                Shop Now →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
              <div className="bg-orange-100 p-3 rounded-lg inline-block mb-3">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="mb-2">Art & Prints</h3>
              <p className="text-sm text-gray-700 mb-3">
                Posters, prints, and wall art
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                Shop Now →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
              <div className="bg-red-100 p-3 rounded-lg inline-block mb-3">
                <Package className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="mb-2">Home & Office</h3>
              <p className="text-sm text-gray-700 mb-3">
                Mugs, notebooks, and desk items
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                Shop Now →
              </a>
            </div>
          </div>

          {/* Accessories Products */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Enamel Pin Set (6 pins)", category: "Collectibles", price: "$15.99" },
              { name: "World Map Poster 24x36", category: "Art & Prints", price: "$19.99" },
              { name: "Character Tote Bag", category: "Bags & Totes", price: "$18.99" },
              { name: "LOREWEAVER Mug", category: "Home & Office", price: "$14.99" },
              { name: "Vinyl Sticker Pack", category: "Collectibles", price: "$8.99" },
              { name: "Limited Edition Art Print", category: "Art & Prints", price: "$24.99" },
              { name: "Leather Bookmark Set", category: "Collectibles", price: "$12.99" },
              { name: "Hardcover Notebook", category: "Home & Office", price: "$16.99" },
              { name: "Canvas Wall Banner", category: "Art & Prints", price: "$29.99" },
              { name: "Mini Backpack", category: "Bags & Totes", price: "$34.99" },
              { name: "Character Patch Set", category: "Collectibles", price: "$11.99" },
              { name: "Travel Mug Set", category: "Home & Office", price: "$22.99" },
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gray-200 border-b-2 border-gray-300 h-40 flex items-center justify-center">
                  <div className="bg-purple-600 rounded-full p-3">
                    <Watch className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-sm mb-1">{product.name}</h4>
                  <p className="text-xs text-gray-600 mb-3">{product.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600">{product.price}</span>
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Games Section */}
        <section id="games">
          <h2 className="mb-6">Games</h2>
          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              Immerse yourself in the LOREWEAVER universe with our collection of games. From board games and card games to tabletop RPG supplements, these games bring the worlds and stories to life in exciting new ways.
            </p>
          </div>

          {/* Featured Game */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg border border-green-200 overflow-hidden mb-8">
            <div className="grid md:grid-cols-5 gap-6">
              <div className="md:col-span-2 bg-gray-200 border-r-2 border-gray-300 min-h-[300px] flex items-center justify-center">
                <div className="bg-green-600 rounded-full p-8">
                  <Gamepad2 className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="md:col-span-3 p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">Featured Game</span>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">Best Seller</span>
                </div>
                <h2 className="mb-3">LOREWEAVER: Realm Quest Board Game</h2>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(127 reviews)</span>
                </div>
                <p className="text-gray-700 mb-4">
                  Embark on epic adventures across the LOREWEAVER multiverse in this strategic board game for 2-5 players. Build your party, explore mysterious realms, and complete quests to become the ultimate hero.
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-sm text-gray-600">
                    <span className="block">Players: 2-5</span>
                    <span className="block">Ages: 14+</span>
                    <span className="block">Playtime: 60-90 min</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl text-blue-600">$44.99</span>
                  <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Game Types */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4">
                <Gamepad2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="mb-3">Board Games</h3>
              <p className="text-sm text-gray-700 mb-4">
                Strategy and adventure games set in the LOREWEAVER universe for groups and families.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                Shop Board Games →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="bg-purple-100 p-3 rounded-lg inline-block mb-4">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="mb-3">Card Games</h3>
              <p className="text-sm text-gray-700 mb-4">
                Quick-playing card games perfect for on-the-go entertainment and party fun.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                Shop Card Games →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="bg-green-100 p-3 rounded-lg inline-block mb-4">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="mb-3">RPG Supplements</h3>
              <p className="text-sm text-gray-700 mb-4">
                Tabletop RPG guides, campaigns, and sourcebooks for your gaming sessions.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                Shop RPG Materials →
              </a>
            </div>
          </div>

          {/* Games Products */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Realm Quest Board Game", type: "Board Game", players: "2-5", price: "$44.99", rating: 5 },
              { name: "Lore Trivia Card Game", type: "Card Game", players: "3-8", price: "$19.99", rating: 4 },
              { name: "Campaign Sourcebook Vol. 1", type: "RPG Supplement", players: "N/A", price: "$34.99", rating: 5 },
              { name: "Character Battle Card Game", type: "Card Game", players: "2-4", price: "$24.99", rating: 4 },
              { name: "World-Building Expansion", type: "Board Game", players: "2-5", price: "$29.99", rating: 5 },
              { name: "Quest Deck: Adventures", type: "Card Game", players: "1-4", price: "$16.99", rating: 4 },
            ].map((game, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gray-200 border-b-2 border-gray-300 h-48 flex items-center justify-center">
                  <div className="bg-green-600 rounded-full p-4">
                    <Gamepad2 className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">{game.type}</span>
                  <h3 className="mt-3 mb-2">{game.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">Players: {game.players}</p>
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= game.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">(89)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600">{game.price}</span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Game Info */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="mb-3">Game Night Resources</h3>
            <p className="text-sm text-gray-700 mb-4">
              Looking for rules clarifications, strategy guides, or printable resources? Visit our game support page for downloads, FAQs, and community-created content.
            </p>
            <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
              Visit Game Support →
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
