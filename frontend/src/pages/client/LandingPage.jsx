import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { IoCheckmarkCircleOutline, IoShieldCheckmarkOutline, IoHeartOutline, IoLeafOutline } from "react-icons/io5"
import { addItem } from "../../utils/cart"
import ProductCard from "../../components/ProductCard"
import heroImg from "../../assets/hero.png"

const heroImages = [
  "/images/cream.png",
  "/images/cleanser.png",
  "/images/serum.png",
  "/images/toner.png"
]

// Mock products in case the database fetch fails or is empty
const fallbackProducts = [
  {
    productId: "BP001",
    name: "Hydrating Face Cleanser",
    labelledPrice: 25.00,
    price: 22.00,
    images: ["/images/face-cleanser.jpg"],
    description: "A gentle hydrating cleanser that removes dirt and makeup while maintaining skin moisture.",
    category: "skincare",
  },
  {
    productId: "BP002",
    name: "Vitamin C Brightening Serum",
    labelledPrice: 42.00,
    price: 38.00,
    images: ["/images/vitamin-c-serum.jpg"],
    description: "A powerful vitamin C serum that brightens skin and reduces dark spots.",
    category: "skincare",
  },
  {
    productId: "BP003",
    name: "Rejuvenating Night Cream",
    labelledPrice: 55.00,
    price: 49.00,
    images: ["/images/night-cream.jpg"],
    description: "Deep nourishing overnight treatment designed to enhance skin firmness and smooth fine lines.",
    category: "skincare",
  }
]

export default function LandingPage() {
  const [bestSellers, setBestSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)
  const navigate = useNavigate()

  // Skin Quiz State
  const [quizStep, setQuizStep] = useState(0) // 0: intro, 1: skin type, 2: concern, 3: steps, 4: results
  const [skinType, setSkinType] = useState("")
  const [concern, setConcern] = useState("")
  const [routineLength, setRoutineLength] = useState("")
  const [quizResult, setQuizResult] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Auto-swipe hero image timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Fetch products for Best Sellers
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          // Take first 3 as best sellers
          setBestSellers(res.data.slice(0, 3))
        } else {
          setBestSellers(fallbackProducts)
        }
      })
      .catch(() => {
        // Fallback gracefully on database error
        setBestSellers(fallbackProducts)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (!newsletterEmail) return
    setNewsletterSubscribed(true)
    toast.success("Subscribed! Check your inbox for 10% off.", {
      style: {
        background: "#1f2937",
        color: "#fff",
        borderRadius: "12px",
      },
    })
  }

  // Quiz Navigation & Logic
  const startQuiz = () => {
    setQuizStep(1)
    setSkinType("")
    setConcern("")
    setRoutineLength("")
    setQuizResult(null)
  }

  const selectSkinType = (type) => {
    setSkinType(type)
    setQuizStep(2)
  }

  const selectConcern = (c) => {
    setConcern(c)
    setQuizStep(3)
  }

  const selectRoutineLength = (length) => {
    setRoutineLength(length)
    calculateQuizResults(skinType, concern, length)
    setQuizStep(4)
  }

  const calculateQuizResults = (type, mainConcern, length) => {
    // Routine builder recommendation mapping
    let routine = []

    // Step 1: Cleanser
    if (type === "oily" || type === "combination") {
      routine.push({
        id: "BP001",
        name: "Clarifying Gel Wash",
        price: 18.00,
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80",
        step: "Step 1: Cleanse",
        desc: "Purifies pores and balances excess oil without drying."
      })
    } else {
      routine.push({
        id: "BP001",
        name: "Hydrating Face Cleanser",
        price: 22.00,
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80",
        step: "Step 1: Cleanse",
        desc: "Gently melts away impurities while locks in essential skin hydration."
      })
    }

    // Step 2: Treatment/Serum (only in complete routine or if anti-aging/brightening concern)
    if (length === "complete" || mainConcern === "brightening" || mainConcern === "anti-aging") {
      if (mainConcern === "brightening") {
        routine.push({
          id: "BP002",
          name: "Vitamin C Brightening Serum",
          price: 38.00,
          image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80",
          step: "Step 2: Treat",
          desc: "Concentrated glow-boosting formula to fade dark spots."
        })
      } else if (mainConcern === "anti-aging") {
        routine.push({
          id: "BP005",
          name: "Retinol Recovery Serum",
          price: 45.00,
          image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=400&q=80",
          step: "Step 2: Treat",
          desc: "Accelerates cell renewal to reduce fine lines and firm skin."
        })
      } else {
        routine.push({
          id: "BP006",
          name: "Hyaluronic Hydrating Serum",
          price: 32.00,
          image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=400&q=80",
          step: "Step 2: Treat",
          desc: "Intense moisture binding to plump skin layers."
        })
      }
    }

    // Step 3: Moisturizer
    if (type === "oily") {
      routine.push({
        id: "BP007",
        name: "Matte Oil-Free Moisturizer",
        price: 26.00,
        image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=400&q=80",
        step: routine.length === 1 ? "Step 2: Moisturize" : "Step 3: Moisturize",
        desc: "Ultra lightweight gel-cream that regulates sebum production."
      })
    } else {
      routine.push({
        id: "BP003",
        name: "Rejuvenating Cream",
        price: 49.00,
        image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=400&q=80",
        step: routine.length === 1 ? "Step 2: Moisturize" : "Step 3: Moisturize",
        desc: "Rich cream loaded with ceramides to rebuild skin barrier."
      })
    }

    // Step 4: Sunscreen (only in complete routine)
    if (length === "complete") {
      routine.push({
        id: "BP008",
        name: "Daily Defense SPF 50+",
        price: 28.00,
        image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80",
        step: "Step 4: Protect",
        desc: "Broad-spectrum mineral filter that absorbs instantly with no white cast."
      })
    }

    setQuizResult({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} & ${mainConcern.charAt(0).toUpperCase() + mainConcern.slice(1)} Routine`,
      description: `Based on your answers, your skin will thrive best on a ${length} routine focusing on balancing ${type} skin with targeting ${mainConcern} solutions.`,
      products: routine
    })
  }

  const addEntireRoutineToCart = () => {
    if (!quizResult) return
    try {
      quizResult.products.forEach(p => {
        addItem({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image
        }, 1)
      })
      toast.success("Full routine added to cart!", {
        position: "bottom-right",
        style: {
          background: "#1f2937",
          color: "#fff",
          borderRadius: "12px"
        }
      })
    } catch (e) {
      console.error(e)
      toast.error("Failed to add routine to cart.")
    }
  }

  return (
    <div className="w-full flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-80px)] bg-gradient-to-tr from-stone-50 via-indigo-50/20 to-stone-100 flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 md:space-y-8 text-left animate-fade-in">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 px-3 py-1 bg-indigo-50 rounded-full inline-block">
              Premium Skincare Essentials
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold text-stone-900 leading-tight">
              Reveal Your <br />
              <span className="text-indigo-600 italic">Natural Radiance</span>
            </h1>
            <p className="text-base sm:text-lg text-stone-600 max-w-lg leading-relaxed">
              Expertly formulated skincare routines powered by nature and backed by science to unveil your skin's inner glow. Cruelty-free, vegan, and designed with premium ingredients.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/products"
                className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px] active:translate-y-0 cursor-pointer"
              >
                Shop Collection
              </Link>
              <button
                onClick={() => {
                  const element = document.getElementById("skin-quiz-section")
                  element?.scrollIntoView({ behavior: "smooth" })
                }}
                className="px-8 py-3.5 bg-white border border-stone-200 hover:border-indigo-500 text-stone-800 hover:text-indigo-600 font-semibold text-sm rounded-full shadow-2xs transition-all duration-200 hover:translate-y-[-2px] active:translate-y-0 cursor-pointer"
              >
                Take Skin Quiz
              </button>
            </div>
          </div>

          {/* Hero Image / Graphics (Auto-swiping Carousel) */}
          <div className="relative flex flex-col justify-center items-center h-full min-h-[350px] w-full">
            {/* Soft ambient background lights */}
            <div className="absolute w-72 h-72 rounded-full bg-indigo-200/35 filter blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute w-60 h-60 rounded-full bg-amber-100/40 filter blur-3xl -z-10 bottom-10 left-10"></div>

            {/* Carousel Container */}
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center overflow-hidden">
              {heroImages.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={`BeautyHub Skincare Slide ${index + 1}`}
                  className={`absolute w-full h-full object-contain drop-shadow-2xl transition-all duration-1000 ease-in-out ${
                    index === currentImageIndex
                      ? "opacity-100 scale-100 translate-x-0"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                />
              ))}
            </div>

            {/* Slider Dot Indicators */}
            <div className="flex gap-2 mt-4 z-10">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentImageIndex
                      ? "bg-indigo-600 w-6"
                      : "bg-stone-300 hover:bg-stone-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Benefits */}
      <section className="w-full py-16 border-y border-stone-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 shadow-3xs">
              <IoShieldCheckmarkOutline size={22} />
            </div>
            <h4 className="text-sm font-bold text-stone-900">Dermatologist Tested</h4>
            <p className="text-xs text-stone-500 mt-1 max-w-[160px]">Approved by clinical experts for all skin types.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 shadow-3xs">
              <IoLeafOutline size={22} />
            </div>
            <h4 className="text-sm font-bold text-stone-900">100% Organic & Vegan</h4>
            <p className="text-xs text-stone-500 mt-1 max-w-[160px]">Only clean, bio-active plant-based formulas.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 shadow-3xs">
              <IoHeartOutline size={22} />
            </div>
            <h4 className="text-sm font-bold text-stone-900">Cruelty-Free</h4>
            <p className="text-xs text-stone-500 mt-1 max-w-[160px]">Never tested on animals, strictly ethical sourcing.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 shadow-3xs">
              <IoCheckmarkCircleOutline size={22} />
            </div>
            <h4 className="text-sm font-bold text-stone-900">Recyclable Glass</h4>
            <p className="text-xs text-stone-500 mt-1 max-w-[160px]">Sustainably bottled in premium glass jars.</p>
          </div>
        </div>
      </section>

      {/* 3. Featured Best Sellers */}
      <section className="w-full py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block">Customer Favorites</span>
            <h2 className="text-3xl font-serif font-bold text-stone-900 sm:text-4xl">Shop Our Best Sellers</h2>
            <p className="text-sm text-stone-500 max-w-md mx-auto">Discover the crowd-pleasers that keep skin glowing all season long.</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-8 justify-center items-center">
              {bestSellers.map((prod) => (
                <ProductCard key={prod.productId} product={prod} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-block px-6 py-3 border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white text-xs font-bold rounded-full transition-all duration-200 shadow-2xs cursor-pointer"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Interactive Skin Routine Quiz */}
      <section id="skin-quiz-section" className="w-full py-20 bg-white border-t border-stone-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block">Routine Finder</span>
            <h2 className="text-3xl font-serif font-bold text-stone-900">Custom Skin Quiz</h2>
            <p className="text-sm text-stone-500">Answer 3 simple questions to construct your dermatologist-recommended daily routine.</p>
          </div>

          <div className="bg-stone-50/70 rounded-3xl p-8 border border-stone-250/30 min-h-[360px] flex flex-col justify-between shadow-xs">
            {/* Step 0: Intro */}
            {quizStep === 0 && (
              <div className="text-center py-10 space-y-6 my-auto">
                <h3 className="text-xl font-serif font-bold text-stone-800">Ready to meet your perfect match?</h3>
                <p className="text-sm text-stone-600 max-w-sm mx-auto">Our interactive recommendation tool analyzes your concerns and selects exact products for a custom morning/evening routine.</p>
                <button
                  onClick={startQuiz}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full shadow-sm cursor-pointer"
                >
                  Start Routine Finder
                </button>
              </div>
            )}

            {/* Step 1: Skin Type */}
            {quizStep === 1 && (
              <div className="space-y-6 my-auto text-center">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Question 1 of 3</span>
                <h3 className="text-lg font-bold text-stone-900">What is your primary skin type?</h3>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2">
                  {["dry", "oily", "combination", "sensitive"].map((type) => (
                    <button
                      key={type}
                      onClick={() => selectSkinType(type)}
                      className="p-4 bg-white border border-stone-200 hover:border-indigo-600 rounded-2xl text-sm font-semibold capitalize text-stone-700 hover:text-indigo-600 transition-colors shadow-2xs hover:shadow-sm"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Main Concern */}
            {quizStep === 2 && (
              <div className="space-y-6 my-auto text-center">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Question 2 of 3</span>
                <h3 className="text-lg font-bold text-stone-900">What is your biggest skincare goal/concern?</h3>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2">
                  {["hydration", "anti-aging", "acne", "brightening"].map((item) => (
                    <button
                      key={item}
                      onClick={() => selectConcern(item)}
                      className="p-4 bg-white border border-stone-200 hover:border-indigo-600 rounded-2xl text-sm font-semibold capitalize text-stone-700 hover:text-indigo-600 transition-colors shadow-2xs hover:shadow-sm"
                    >
                      {item === "acne" ? "acne & pores" : item}
                    </button>
                  ))}
                </div>
                <button onClick={() => setQuizStep(1)} className="text-xs text-stone-400 hover:text-stone-600 underline">Back</button>
              </div>
            )}

            {/* Step 3: Routine Length */}
            {quizStep === 3 && (
              <div className="space-y-6 my-auto text-center">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Question 3 of 3</span>
                <h3 className="text-lg font-bold text-stone-900">How many steps do you prefer?</h3>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2">
                  <button
                    onClick={() => selectRoutineLength("minimalist")}
                    className="p-4 bg-white border border-stone-200 hover:border-indigo-600 rounded-2xl text-left shadow-2xs hover:shadow-sm"
                  >
                    <h4 className="text-sm font-bold text-stone-900">Minimalist</h4>
                    <p className="text-xs text-stone-500 mt-1">Cleanser + Moisturizer. Fast, easy, and essential.</p>
                  </button>
                  <button
                    onClick={() => selectRoutineLength("complete")}
                    className="p-4 bg-white border border-stone-200 hover:border-indigo-600 rounded-2xl text-left shadow-2xs hover:shadow-sm"
                  >
                    <h4 className="text-sm font-bold text-stone-900">Complete</h4>
                    <p className="text-xs text-stone-500 mt-1">Includes targeted serums and SPF protection.</p>
                  </button>
                </div>
                <button onClick={() => setQuizStep(2)} className="text-xs text-stone-400 hover:text-stone-600 underline block mx-auto">Back</button>
              </div>
            )}

            {/* Step 4: Results */}
            {quizStep === 4 && quizResult && (
              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">Your Custom Match</span>
                  <h3 className="text-2xl font-serif font-bold text-stone-900 mt-2">{quizResult.title}</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">{quizResult.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4">
                  {quizResult.products.map((p) => (
                    <div key={p.id} className="bg-white border border-stone-100 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
                      <div>
                        <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block">{p.step}</span>
                        <h4 className="text-xs font-bold text-stone-900 mt-1 line-clamp-1">{p.name}</h4>
                        <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">{p.desc}</p>
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-stone-50">
                        <span className="text-xs font-bold text-stone-950">${p.price.toFixed(2)}</span>
                        <button
                          onClick={() => {
                            addItem({ id: p.id, name: p.name, price: p.price, image: p.image }, 1)
                            toast.success(`Added ${p.name}!`)
                          }}
                          className="px-2 py-1 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white text-[9px] font-bold rounded-lg transition-colors"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-4 border-t border-stone-200/50 pt-4">
                  <button
                    onClick={startQuiz}
                    className="px-5 py-2.5 bg-white border border-stone-250 text-stone-700 text-xs font-semibold rounded-full hover:bg-stone-50"
                  >
                    Retake Quiz
                  </button>
                  <button
                    onClick={addEntireRoutineToCart}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full shadow-sm"
                  >
                    Add Complete Routine to Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Customer Testimonials */}
      <section className="w-full py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block">Client Love</span>
            <h2 className="text-3xl font-serif font-bold text-stone-900 sm:text-4xl">What Glow Seekers Say</h2>
            <p className="text-sm text-stone-500 max-w-sm mx-auto">Real reviews from our beautiful community who unlocked their glow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "The Hydrating Face Cleanser literally restored my barrier! My dry patches are completely gone in two weeks, and it melts make-up like a dream.",
                name: "Sarah M.",
                verified: true,
                rating: 5,
              },
              {
                text: "Absolutely love the Vitamin C Serum. It has cleared up my post-acne dark marks and left a really nice, glassy glow. I am onto my second bottle!",
                name: "Liam T.",
                verified: true,
                rating: 5,
              },
              {
                text: "I was skeptical about taking the quiz, but the suggested routine for my combination oily skin is perfect. Not greasy at all, super lightweight.",
                name: "Jessie L.",
                verified: true,
                rating: 5,
              }
            ].map((rev, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-stone-150/40 shadow-3xs flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-sm italic text-stone-600 leading-relaxed font-serif">"{rev.text}"</p>
                </div>
                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-stone-50">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm">
                    {rev.name[0]}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-stone-900">{rev.name}</h5>
                    {rev.verified && <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">✓ Verified Buyer</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Newsletter / Discount Form */}
      <section className="w-full py-24 bg-gradient-to-br from-indigo-900 via-stone-950 to-stone-950 text-white overflow-hidden relative">
        {/* Abstract glowing shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-indigo-500/10 filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-rose-500/5 filter blur-3xl"></div>

        <div className="max-w-3xl mx-auto px-6 text-center space-y-8 relative z-10">
          <span className="text-xs font-bold tracking-widest uppercase text-indigo-400">Join the Glow Club</span>
          <h2 className="text-3xl font-serif font-bold sm:text-4xl text-white">Unlock 10% Off Your First Order</h2>
          <p className="text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
            Subscribe to our newsletter to receive skincare advice, early access to new releases, and an exclusive discount code.
          </p>

          {newsletterSubscribed ? (
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl max-w-md mx-auto animate-fade-in">
              <h4 className="text-base font-bold text-indigo-300">Welcome to AuraSkin!</h4>
              <p className="text-xs text-stone-400 mt-2">
                Use coupon code <span className="font-mono font-bold text-white bg-indigo-600 px-2 py-0.5 rounded-md">AURAGLOW10</span> at checkout for 10% off.
              </p>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-5 py-3.5 bg-white/5 border border-white/10 focus:border-indigo-500 rounded-full text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-white hover:bg-stone-100 text-stone-900 font-bold text-sm rounded-full shadow-md transition-colors cursor-pointer shrink-0"
              >
                Join Now
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="w-full py-12 bg-stone-950 text-stone-500 border-t border-white/5 text-xs text-center">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="font-serif text-lg font-bold tracking-wide text-white">BeautyHub</span>
            <div className="flex gap-6">
              <Link to="/products" className="hover:text-white transition-colors">Products</Link>
              <Link to="/reviews" className="hover:text-white transition-colors">Reviews</Link>
              <Link to="/about-us" className="hover:text-white transition-colors">About Us</Link>
              <Link to="/contact-us" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 text-stone-600 flex flex-col sm:flex-row justify-between gap-4">
            <p>© {new Date().getFullYear()} BeautyHub Inc. All rights reserved.</p>
            <p>Made with love for beautiful, healthy skin.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
