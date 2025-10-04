import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, Brain, Users, BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';

interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  tips: string[];
  color: string;
  icon: React.ReactNode;
}

interface BlogPost {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

const MentalHealthBlog: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const carouselSlides: CarouselSlide[] = [
    {
      id: 1,
      title: "Finding Mental Peace",
      description: "Simple daily practices for inner calm",
      tips: [
        "Start your day with 5 minutes of deep breathing",
        "Create a dedicated quiet space in your home",
        "Practice gratitude journaling before bed",
        "Limit social media to 30 minutes daily"
      ],
      color: "from-blue-900 to-cyan-900",
      icon: <Heart className="w-12 h-12 text-pink-700" />
    },
    {
      id: 2,
      title: "Stress Relief Techniques",
      description: "Evidence-based methods to reduce stress",
      tips: [
        "Try the 4-7-8 breathing technique to calm stress.",
        "Take short walking breaks every 90 minutes",
        "Use progressive muscle relaxation before sleep",
        "Schedule worry time instead of constant rumination"
      ],
      color: "from-purple-900 to-pink-900",
      icon: <Brain className="w-12 h-12 text-cyan-400" />
    },
    {
      id: 3,
      title: "Managing Anxiety",
      description: "Practical tools for anxious moments",
      tips: [
        "Use the 5-4-3-2-1 grounding technique",
        "Challenge negative thoughts with evidence",
        "Maintain regular sleep and meal schedules",
        "Connect with a trusted friend or therapist"
      ],
      color: "from-green-900 to-emerald-900",
      icon: <Users className="w-12 h-12 text-orange-500" />
    },
    {
      id: 4,
      title: "Building Resilience",
      description: "Strengthen your mental health foundation",
      tips: [
        "Develop a consistent exercise routine",
        "Practice self-compassion in difficult times",
        "Set realistic goals and celebrate small wins",
        "Build a support network you can rely on"
      ],
      color: "from-orange-900 to-yellow-900",
      icon: <BookOpen className="w-12 h-12 text-green-600" />
    }
  ];

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      category: "Case Story",
      title: "Finding Light After Darkness: A Student's Journey with Depression",
      excerpt: "An anonymized story of a 19-year-old college student who overcame severe depression through therapy, medication, and building a support system. Learn about the warning signs and the path to recovery.",
      author: "Dr. Sarah Mitchell",
      date: "Oct 1, 2025",
      readTime: "8 min read",
      image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      id: 2,
      category: "Personal Story",
      title: "My Experience with Burnout: Lessons from a Teacher",
      excerpt: "A candid reflection from an educator who faced burnout after five years of teaching. Discover the signs they missed and the strategies that helped them recover and find balance.",
      author: "Anonymous Contributor",
      date: "Sep 28, 2025",
      readTime: "6 min read",
      image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      id: 3,
      category: "Research Insights",
      title: "The Neuroscience of Anxiety: Understanding Your Brain's Alarm System",
      excerpt: "Recent studies reveal how the amygdala and prefrontal cortex interact during anxiety. Understanding this mechanism can help you develop more effective coping strategies.",
      author: "Dr. James Chen",
      date: "Sep 25, 2025",
      readTime: "10 min read",
      image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      id: 4,
      category: "Case Story",
      title: "When Perfectionism Becomes a Prison: A Teen's Story",
      excerpt: "An anonymized account of a 16-year-old high achiever whose perfectionism led to anxiety and self-harm. Explore the intervention that changed everything.",
      author: "Dr. Maria Rodriguez",
      date: "Sep 22, 2025",
      readTime: "7 min read",
      image: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
    },
    {
      id: 5,
      category: "News & Analysis",
      title: "Rising Mental Health Challenges in Post-Pandemic Youth",
      excerpt: "New WHO data shows a 25% increase in anxiety and depression among young people. We analyze the factors contributing to this crisis and what communities can do.",
      author: "Editorial Team",
      date: "Sep 20, 2025",
      readTime: "12 min read",
      image: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    },
    {
      id: 6,
      category: "Expert Insights",
      title: "Best Practices for Supporting a Friend in Crisis",
      excerpt: "Mental health professionals share evidence-based approaches for helping someone who's struggling. Learn what to say, what to avoid, and when to seek professional help.",
      author: "Dr. Emily Thompson",
      date: "Sep 18, 2025",
      readTime: "9 min read",
      image: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    setIsAutoPlaying(false);
  };

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      "Case Story": "bg-purple-900/50 text-purple-300 border border-purple-700",
      "Personal Story": "bg-pink-900/50 text-pink-300 border border-pink-700",
      "Research Insights": "bg-blue-900/50 text-blue-300 border border-blue-700",
      "News & Analysis": "bg-green-900/50 text-green-300 border border-green-700",
      "Expert Insights": "bg-orange-900/50 text-orange-300 border border-orange-700"
    };
    return colors[category] || "bg-gray-800/50 text-gray-300 border border-gray-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Hero Section */}
      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground/80 bg-clip-text text-transparent leading-tight">Wellness Wisdom</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Personal stories, expert guidance, and actionable strategies for your mental wellbeing journey
            </p>
          </div>
        </div>
      

      {/* Carousel Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-16">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="relative">
            <div className={`bg-gradient-to-r ${carouselSlides[currentSlide].color} p-8 sm:p-12`}>
              <div className="flex items-center justify-center mb-6">
                {carouselSlides[currentSlide].icon}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-200 text-center mb-2">
                {carouselSlides[currentSlide].title}
              </h2>
              <p className="text-xl text-gray-300 text-center mb-6">
                {carouselSlides[currentSlide].description}
              </p>
              <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {carouselSlides[currentSlide].tips.map((tip, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 transform hover:scale-105 transition-transform border border-white/20">
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-neutral-100 font-bold text-sm mr-3 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-neutral-200 font-medium">{tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-900/50 hover:bg-gray-900/70 backdrop-blur-sm rounded-full p-3 transition-all border border-gray-700"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900/50 hover:bg-gray-900/70 backdrop-blur-sm rounded-full p-3 transition-all border border-gray-700"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Carousel Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {carouselSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentSlide(idx);
                    setIsAutoPlaying(false);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground/80 bg-clip-text text-transparent leading-tight mb-4">Latest Articles & Stories</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore real experiences, expert insights, and evidence-based strategies
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group border border-gray-700"
            >
              <div
                className="h-48 relative"
                style={{ background: post.image }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(post.category)}`}>
                  {post.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <span className="text-sm font-medium text-gray-300">{post.author}</span>
                  <button className="flex items-center gap-1 text-indigo-400 font-semibold group-hover:gap-2 transition-all">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Resources Section */}
      <div className="bg-gradient-to-r from-indigo-950 to-purple-950 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground/80 bg-clip-text text-transparent leading-tight">Need Immediate Support?</h2>
            <p className="text-xl text-indigo-100 mb-8">
              If you're experiencing a mental health crisis, please reach out to these resources:
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="font-bold text-lg mb-2 text-white">Crisis Helpline</h3>
                <p className="text-indigo-100">Available 24/7 for immediate support</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="font-bold text-lg mb-2 text-white">Find a Therapist</h3>
                <p className="text-indigo-100">Connect with licensed professionals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthBlog;