import { PageNavDropdown } from "./components/PageNavDropdown";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { useState } from "react";

export default function Titles() {
  // Define page sections for jump-to navigation
  const pageSections = [
    { label: "All Titles", id: "all-titles" },
    { label: "New Releases", id: "new-releases" },
    { label: "Popular", id: "popular" },
  ];

  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState<string>("all-titles");

  // Content for each category
  const categoryContent: Record<string, { title: string; description: string }> = {
    "all-titles": {
      title: "All Titles",
      description: "Browse our complete collection of stories across all formats and genres. From novels to comics, audio dramas to animations, discover everything LOREWEAVER Publications has to offer."
    },
    "books": {
      title: "Books",
      description: "Immerse yourself in our full-length novels spanning epic fantasy, science fiction, contemporary fiction, and more. Each book is crafted to transport you to new worlds and unforgettable adventures."
    },
    "short-stories": {
      title: "Short Stories",
      description: "Perfect for quick reads and bite-sized adventures. Our short story collection offers glimpses into fascinating worlds and compelling characters that will leave you wanting more."
    },
    "comics": {
      title: "Comics",
      description: "Experience storytelling through stunning visual narratives. Our comics bring vibrant characters and dynamic action to life with beautiful artwork and compelling plots."
    },
    "audio": {
      title: "Audio",
      description: "Listen to our stories come alive through professionally produced audiobooks and audio dramas. Perfect for commutes, workouts, or relaxing at home."
    },
    "animation": {
      title: "Animation",
      description: "Watch our stories unfold in animated form. From short films to series, experience LOREWEAVER's worlds through the magic of animation."
    },
    "games": {
      title: "Games",
      description: "Step into our stories and become part of the adventure. Our games let you explore, interact, and shape the narrative in immersive, playable experiences."
    },
    "mystery": {
      title: "??",
      description: "Something mysterious awaits... What could this be? Only the most curious explorers will discover what lies hidden in this enigmatic section."
    }
  };

  // Titles data for each category
  const titlesData: Record<string, Array<{
    id: number;
    title: string;
    author: string;
    format: string;
    description: string;
    imageUrl: string;
    gradient: string;
  }>> = {
    "all-titles": [
      {
        id: 1,
        title: "Chronicles of the Void",
        author: "Elena Nightshade",
        format: "Book",
        description: "An epic fantasy series where ancient magic collides with modern intrigue.",
        imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
        gradient: "from-purple-600 to-blue-800"
      },
      {
        id: 2,
        title: "Echoes of Tomorrow",
        author: "Marcus Chen",
        format: "Book",
        description: "A mind-bending science fiction adventure exploring identity and consciousness.",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
        gradient: "from-emerald-600 to-teal-800"
      },
      {
        id: 3,
        title: "Starborn Chronicles",
        author: "Various Authors",
        format: "Comic",
        description: "A visual epic following heroes across galaxies in stunning artwork.",
        imageUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop",
        gradient: "from-orange-600 to-red-800"
      },
      {
        id: 4,
        title: "Whispers in the Dark",
        author: "Narrated by Sarah Mitchell",
        format: "Audio",
        description: "A haunting audio drama that brings supernatural mystery to life.",
        imageUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=600&fit=crop",
        gradient: "from-indigo-600 to-purple-800"
      },
      {
        id: 5,
        title: "Tales from the Crossroads",
        author: "J.K. Morrison",
        format: "Short Stories",
        description: "A collection of interconnected stories exploring parallel dimensions.",
        imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
        gradient: "from-red-600 to-orange-800"
      },
      {
        id: 6,
        title: "Realm of Shadows",
        author: "Studio Nexus",
        format: "Animation",
        description: "An animated series bringing fantasy realms to vibrant life.",
        imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
        gradient: "from-pink-600 to-purple-800"
      }
    ],
    "books": [
      {
        id: 1,
        title: "Chronicles of the Void",
        author: "Elena Nightshade",
        format: "Epic Fantasy",
        description: "Ancient magic meets modern intrigue in this sprawling fantasy saga spanning three realms.",
        imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
        gradient: "from-purple-600 to-blue-800"
      },
      {
        id: 2,
        title: "Echoes of Tomorrow",
        author: "Marcus Chen",
        format: "Science Fiction",
        description: "Time, consciousness, and reality intertwine in this philosophical sci-fi masterpiece.",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
        gradient: "from-emerald-600 to-teal-800"
      },
      {
        id: 3,
        title: "The Last Starkeeper",
        author: "Aria Moonstone",
        format: "Space Opera",
        description: "One guardian stands between the universe and eternal darkness.",
        imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
        gradient: "from-red-600 to-orange-800"
      },
      {
        id: 4,
        title: "Shadowmere",
        author: "Devon Blackwood",
        format: "Dark Fantasy",
        description: "In a city where shadows have teeth, one detective hunts the impossible.",
        imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop",
        gradient: "from-gray-700 to-black"
      },
      {
        id: 5,
        title: "Quantum Hearts",
        author: "Dr. Yuki Tanaka",
        format: "Sci-Fi Romance",
        description: "Love transcends dimensions in this genre-bending romance.",
        imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
        gradient: "from-pink-500 to-rose-700"
      },
      {
        id: 6,
        title: "The Dragonmarked Heir",
        author: "Kellan Frost",
        format: "Young Adult Fantasy",
        description: "A reluctant prince discovers his destiny lies in the ancient dragonbonds.",
        imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
        gradient: "from-amber-600 to-orange-800"
      }
    ],
    "short-stories": [
      {
        id: 1,
        title: "Tales from the Crossroads",
        author: "J.K. Morrison",
        format: "Collection - 12 Stories",
        description: "Parallel dimensions collide in these interconnected tales of wonder and mystery.",
        imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
        gradient: "from-red-600 to-orange-800"
      },
      {
        id: 2,
        title: "Midnight Musings",
        author: "Various Authors",
        format: "Anthology",
        description: "Twenty authors explore the space between dreams and reality.",
        imageUrl: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop",
        gradient: "from-indigo-700 to-purple-900"
      },
      {
        id: 3,
        title: "Fractured Fables",
        author: "Riley Summers",
        format: "Collection - 8 Stories",
        description: "Classic fairy tales reimagined with dark, modern twists.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
        gradient: "from-violet-600 to-fuchsia-800"
      },
      {
        id: 4,
        title: "Neon Dreams",
        author: "Kai Rodriguez",
        format: "Cyberpunk Stories",
        description: "Six tales of technology, humanity, and the spaces between.",
        imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop",
        gradient: "from-cyan-600 to-blue-900"
      }
    ],
    "comics": [
      {
        id: 1,
        title: "Starborn Chronicles",
        author: "Art by Maya Santos",
        format: "Ongoing Series",
        description: "Heroes across galaxies unite against an ancient cosmic threat. Issue #24 available now.",
        imageUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop",
        gradient: "from-orange-600 to-red-800"
      },
      {
        id: 2,
        title: "Urban Legends",
        author: "Written by Alex Thorn",
        format: "Limited Series - 12 Issues",
        description: "Street-level heroes face supernatural threats in a gritty city setting.",
        imageUrl: "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=400&h=600&fit=crop",
        gradient: "from-slate-700 to-zinc-900"
      },
      {
        id: 3,
        title: "The Elementals",
        author: "Art by Jordan Lee",
        format: "Graphic Novel",
        description: "Four teens discover they control the classical elements in this coming-of-age epic.",
        imageUrl: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=400&h=600&fit=crop",
        gradient: "from-emerald-500 to-teal-700"
      },
      {
        id: 4,
        title: "Voidwalkers",
        author: "Created by Sam Park",
        format: "Ongoing Series",
        description: "Explorers navigate the space between dimensions in this mind-bending adventure.",
        imageUrl: "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=600&fit=crop",
        gradient: "from-purple-700 to-indigo-900"
      }
    ],
    "audio": [
      {
        id: 1,
        title: "Whispers in the Dark",
        author: "Narrated by Sarah Mitchell",
        format: "Audio Drama - 8 Episodes",
        description: "A haunting supernatural mystery told through immersive sound design.",
        imageUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=600&fit=crop",
        gradient: "from-indigo-600 to-purple-800"
      },
      {
        id: 2,
        title: "Chronicles of the Void",
        author: "Narrated by James Marsters",
        format: "Audiobook - 18 Hours",
        description: "The epic fantasy brought to life by an award-winning narrator.",
        imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
        gradient: "from-purple-600 to-blue-800"
      },
      {
        id: 3,
        title: "Echoes of Tomorrow",
        author: "Narrated by Tessa Thompson",
        format: "Audiobook - 14 Hours",
        description: "Experience the mind-bending sci-fi through cinematic narration.",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
        gradient: "from-emerald-600 to-teal-800"
      },
      {
        id: 4,
        title: "The Midnight Frequency",
        author: "Full Cast Audio Drama",
        format: "Limited Series - 6 Episodes",
        description: "A mysterious radio signal leads investigators into the unknown.",
        imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=600&fit=crop",
        gradient: "from-rose-600 to-red-800"
      }
    ],
    "animation": [
      {
        id: 1,
        title: "Realm of Shadows",
        author: "Studio Nexus",
        format: "Animated Series - Season 1",
        description: "12 episodes of breathtaking fantasy animation exploring magical realms.",
        imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
        gradient: "from-pink-600 to-purple-800"
      },
      {
        id: 2,
        title: "Starborn: The Movie",
        author: "Studio Nexus",
        format: "Animated Film - 98 Minutes",
        description: "The comic series comes to life in this cinematic animated adventure.",
        imageUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop",
        gradient: "from-orange-600 to-red-800"
      },
      {
        id: 3,
        title: "Chronicles Animated",
        author: "Studio Loreweaver",
        format: "Animated Shorts",
        description: "A collection of 10 short films exploring side stories from the Chronicles universe.",
        imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop",
        gradient: "from-blue-600 to-indigo-800"
      }
    ],
    "games": [
      {
        id: 1,
        title: "Chronicles: Realms of Power",
        author: "Loreweaver Interactive",
        format: "RPG - PC/Console",
        description: "Explore the world of Chronicles in this open-world role-playing epic.",
        imageUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=600&fit=crop",
        gradient: "from-purple-700 to-blue-900"
      },
      {
        id: 2,
        title: "Starborn: Galactic Alliance",
        author: "Nexus Games",
        format: "Strategy Game - Mobile/PC",
        description: "Build your fleet and forge alliances in this space strategy game.",
        imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=600&fit=crop",
        gradient: "from-orange-600 to-red-800"
      },
      {
        id: 3,
        title: "The Last Starkeeper VR",
        author: "VR Studios",
        format: "VR Experience",
        description: "Step into the role of the Starkeeper in immersive virtual reality.",
        imageUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=600&fit=crop",
        gradient: "from-cyan-600 to-blue-900"
      },
      {
        id: 4,
        title: "Shadowmere: Detective's Case",
        author: "Mystery Labs",
        format: "Adventure Game - All Platforms",
        description: "Solve supernatural mysteries in this narrative-driven adventure.",
        imageUrl: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=400&h=600&fit=crop",
        gradient: "from-gray-700 to-black"
      }
    ],
    "mystery": [
      {
        id: 1,
        title: "Project Enigma",
        author: "???",
        format: "Unknown Format",
        description: "Something is coming. Can you decipher the clues?",
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop",
        gradient: "from-gray-900 to-black"
      },
      {
        id: 2,
        title: "The Untold Story",
        author: "Anonymous",
        format: "Classified",
        description: "A story that exists between the pages of reality.",
        imageUrl: "https://images.unsplash.com/photo-1506606401543-2e73709cebb4?w=400&h=600&fit=crop",
        gradient: "from-indigo-900 to-purple-950"
      },
      {
        id: 3,
        title: "[REDACTED]",
        author: "[DATA EXPUNGED]",
        format: "???",
        description: "Not all stories are meant to be told... yet.",
        imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop",
        gradient: "from-slate-800 to-zinc-950"
      }
    ]
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 flex-1">
      {/* Page Navigation Dropdown - Floats over page below nav banner */}
      <PageNavDropdown items={pageSections} />

      <div>
        <h1 className="mb-6 text-4xl font-bold">Our Titles</h1>
        
        <div className="space-y-4 text-gray-700 mb-12">
          <p>
            Explore the growing library of LOREWEAVER Publications. From epic fantasy novels to gripping science fiction, our catalog features stories that transport you to worlds untraveled.
          </p>
        </div>

        {/* Horizontal Navigation Menu */}
        <nav className="bg-[#3f3d43] rounded-lg shadow-md border border-gray-200 p-4 mb-6">
          <ul className="flex flex-wrap items-center justify-center gap-4 lg:gap-8">
            <li>
              <button 
                onClick={() => setSelectedCategory("all-titles")}
                className={`px-3 py-2 rounded transition-colors text-lg font-bold ${
                  selectedCategory === "all-titles" 
                    ? "bg-[#3d0099] text-white" 
                    : "text-gray-200 hover:text-white hover:bg-gray-700"
                }`}
              >
                All Titles
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedCategory("books")}
                className={`px-3 py-2 rounded transition-colors text-lg font-bold ${
                  selectedCategory === "books" 
                    ? "bg-[#3d0099] text-white" 
                    : "text-gray-200 hover:text-white hover:bg-gray-700"
                }`}
              >
                Books
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedCategory("short-stories")}
                className={`px-3 py-2 rounded transition-colors text-lg font-bold ${
                  selectedCategory === "short-stories" 
                    ? "bg-[#3d0099] text-white" 
                    : "text-gray-200 hover:text-white hover:bg-gray-700"
                }`}
              >
                Short Stories
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedCategory("comics")}
                className={`px-3 py-2 rounded transition-colors text-lg font-bold ${
                  selectedCategory === "comics" 
                    ? "bg-[#3d0099] text-white" 
                    : "text-gray-200 hover:text-white hover:bg-gray-700"
                }`}
              >
                Comics
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedCategory("audio")}
                className={`px-3 py-2 rounded transition-colors text-lg font-bold ${
                  selectedCategory === "audio" 
                    ? "bg-[#3d0099] text-white" 
                    : "text-gray-200 hover:text-white hover:bg-gray-700"
                }`}
              >
                Audio
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedCategory("animation")}
                className={`px-3 py-2 rounded transition-colors text-lg font-bold ${
                  selectedCategory === "animation" 
                    ? "bg-[#3d0099] text-white" 
                    : "text-gray-200 hover:text-white hover:bg-gray-700"
                }`}
              >
                Animation
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedCategory("games")}
                className={`px-3 py-2 rounded transition-colors text-lg font-bold ${
                  selectedCategory === "games" 
                    ? "bg-[#3d0099] text-white" 
                    : "text-gray-200 hover:text-white hover:bg-gray-700"
                }`}
              >
                Games
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedCategory("mystery")}
                className={`px-3 py-2 rounded transition-colors text-lg font-bold ${
                  selectedCategory === "mystery" 
                    ? "bg-[#3d0099] text-white" 
                    : "text-gray-200 hover:text-white hover:bg-gray-700"
                }`}
              >
                ??
              </button>
            </li>
          </ul>
        </nav>

        {/* Category Content Box */}
        <div className="bg-[#48454f] rounded-lg shadow-md border border-gray-600 p-8 mb-16">
          <h3 className="mb-6 text-white">{categoryContent[selectedCategory].title}</h3>
          <p className="text-gray-200 leading-relaxed mb-8">
            {categoryContent[selectedCategory].description}
          </p>

          {/* Titles List with Scrolling */}
          <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4">
            {titlesData[selectedCategory].map((item) => (
              <div key={item.id} className="bg-[#5618c9] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex gap-6 p-4">
                  <div className={`w-32 flex-shrink-0 aspect-[2/3] bg-gradient-to-br ${item.gradient} rounded overflow-hidden`}>
                    <ImageWithFallback 
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-2 text-white">{item.title}</h4>
                    <p className="text-sm text-gray-200 mb-3">{item.author}</p>
                    <div className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs mb-3">
                      {item.format}
                    </div>
                    <p className="text-sm text-gray-100">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Titles Section */}
      <section id="all-titles">
      </section>

      {/* New Releases Section */}
      <section id="new-releases" className="mb-16">
        <h2 className="mb-6 text-3xl font-bold">New Releases</h2>
        <div className="bg-[#48454f] rounded-lg shadow-md p-8 border border-gray-600">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-[2/3] bg-gradient-to-br from-purple-600 to-blue-800 rounded-lg overflow-hidden">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop"
                alt="New release book cover"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm mb-4 w-fit">
                New Release
              </div>
              <h3 className="mb-4 text-white">Chronicles of the Void</h3>
              <p className="text-gray-300 mb-2">by Author Name</p>
              <p className="text-gray-200 mb-6">
                Dive into an expansive new fantasy series where ancient magic collides with modern intrigue. 
                Follow our heroes as they navigate treacherous political landscapes and face cosmic threats 
                that could reshape reality itself.
              </p>
              <div className="space-y-2 text-gray-200">
                <p className="text-sm"><strong>Genre:</strong> Epic Fantasy</p>
                <p className="text-sm"><strong>Release Date:</strong> November 2025</p>
                <p className="text-sm"><strong>Format:</strong> Hardcover, eBook, Audiobook</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Section */}
      <section id="popular" className="mb-16">
        <h2 className="mb-6 text-3xl font-bold">Popular</h2>
        <div className="space-y-6">
          {/* Popular Book 1 */}
          <div className="bg-[#48454f] rounded-lg shadow-md p-6 border border-gray-600">
            <div className="flex gap-6">
              <div className="w-32 aspect-[2/3] bg-gradient-to-br from-emerald-600 to-teal-800 rounded flex-shrink-0 overflow-hidden">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop"
                  alt="Popular book cover"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-white">Echoes of Tomorrow</h3>
                <p className="text-sm text-gray-300 mb-3">by Author Name</p>
                <p className="text-gray-200 mb-4">
                  A mind-bending science fiction adventure that has captured the hearts of readers worldwide. 
                  This bestseller explores themes of identity, consciousness, and the nature of reality itself.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">★ 4.8/5</span>
                  <span>|</span>
                  <span>10,000+ readers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Book 2 */}
          <div className="bg-[#48454f] rounded-lg shadow-md p-6 border border-gray-600">
            <div className="flex gap-6">
              <div className="w-32 aspect-[2/3] bg-gradient-to-br from-red-600 to-orange-800 rounded flex-shrink-0 overflow-hidden">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop"
                  alt="Popular book cover"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-white">The Last Starkeeper</h3>
                <p className="text-sm text-gray-300 mb-3">by Author Name</p>
                <p className="text-gray-200 mb-4">
                  An enchanting tale of cosmic guardianship and personal sacrifice. When darkness threatens 
                  to consume the universe, one unlikely hero must embrace their destiny to save all of existence.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">★ 4.9/5</span>
                  <span>|</span>
                  <span>15,000+ readers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}