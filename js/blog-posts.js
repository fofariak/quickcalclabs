const blogPosts = [

  // This array holds all the blog post data.
  // To add a new post, just add a new object to this list.
  // The blog.html page will update automatically.

  {
    title: "How to Maintain a Healthy BMI: A Practical Guide",
    href: "blog/how-to-maintain-healthy-bmi.html",
    excerpt: "Learn practical, sustainable strategies for maintaining a healthy BMI through balanced nutrition, regular exercise, and positive lifestyle habits.",
    category: "health",
    date: "September 3, 2025",
    readTime: "6 min read",
    featured: true // This post will be highlighted at the top.
  },
  {
    title: "10 Effective Tips to Reduce Your BMI",
    href: "blog/10-tips-to-reduce-bmi.html",
    excerpt: "Discover 10 simple and effective tips to help you reduce your BMI through smart diet choices, sustainable exercise habits, and healthy lifestyle changes.",
    category: "fitness",
    date: "September 2, 2025",
    readTime: "5 min read",
    featured: false
  },
  {
    title: "Understanding Your Menstrual Cycle: A Simple Guide",
    href: "blog/understanding-your-menstrual-cycle.html",
    excerpt: "Learn about the four phases of your menstrual cycle, from your period to ovulation and beyond. Understand the hormones at play and what's normal for you.",
    category: "pregnancy",
    date: "September 2, 2025",
    readTime: "5 min read",
    featured: false
  },
  {
    title: "Fertility Tips for Women: A Guide to Conception",
    href: "blog/fertility-tips-for-women.html",
    excerpt: "Discover practical and effective fertility tips for women, from tracking ovulation and timing intercourse to nutrition and lifestyle changes.",
    category: "pregnancy",
    date: "September 1, 2025",
    readTime: "5 min read",
    featured: false
  },
  {
    title: "The Ultimate Pregnancy Diet: Best Foods for You and Your Baby",
    href: "blog/best-foods-for-pregnancy.html",
    excerpt: "Discover the best nutrient-dense foods to eat during pregnancy for your health and your baby's development, covering folate, iron, and calcium.",
    category: "pregnancy",
    date: "September 1, 2025",
    readTime: "5 min read",
    featured: false
  },
  {
    title: "A Simple Guide to the Three Trimesters of Pregnancy",
    href: "blog/trimester-guide-for-expecting-mothers.html",
    excerpt: "Learn what to expect during the first, second, and third trimesters of pregnancy, from your baby's development to common symptoms and key milestones.",
    category: "pregnancy",
    date: "August 31, 2025",
    readTime: "6 min read",
    featured: false
  },
  {
    title: "How Many Calories Do You Really Need? A Simple Guide",
    href: "blog/how-many-calories-do-you-need.html",
    excerpt: "Learn how to determine your daily calorie needs for weight loss, maintenance, or muscle gain. Understand BMR, TDEE, and how activity level affects your intake.",
    category: "nutrition",
    date: "August 30, 2025",
    readTime: "5 min read",
    featured: false
  },
  {
    title: "The Ultimate Guide to Daily Hydration",
    href: "blog/ultimate-guide-to-daily-hydration.html",
    excerpt: "Discover your personal daily water intake needs. Learn the factors that affect hydration and get practical tips for drinking more water throughout the day.",
    category: "health",
    date: "August 29, 2025",
    readTime: "4 min read",
    featured: false
  },
  {
    title: "7 Surprising Health Benefits of Staying Hydrated",
    href: "blog/health-benefits-of-hydration.html",
    excerpt: "Explore the amazing health benefits of drinking enough water, from boosting energy and brain function to improving skin health and aiding weight loss.",
    category: "health",
    date: "August 29, 2025",
    readTime: "4 min read",
    featured: false
  },
  {
    title: "Body Fat % vs. BMI: Which Metric Matters More for Your Health?",
    href: "blog/body-fat-vs-bmi.html",
    excerpt: "Understand the key differences between Body Fat Percentage and BMI. Learn which measurement provides a more accurate picture of your health.",
    category: "health",
    date: "August 28, 2025",
    readTime: "5 min read",
    featured: false
  },
  {
    title: "How to Reduce Body Fat Naturally: 8 Sustainable Strategies",
    href: "blog/how-to-reduce-body-fat-naturally.html",
    excerpt: "Learn how to lose body fat sustainably without extreme diets. Discover natural methods involving nutrition, exercise, sleep, and stress management.",
    category: "fitness",
    date: "August 28, 2025",
    readTime: "6 min read",
    featured: false
  },
  {
    title: "A Complete Guide to Macronutrients: Protein, Carbs, and Fats Explained",
    href: "blog/complete-guide-to-macro-nutrients.html",
    excerpt: "A simple guide to understanding the three macronutrients. Learn what they are, why your body needs them, and find healthy food sources.",
    category: "nutrition",
    date: "August 27, 2025",
    readTime: "5 min read",
    featured: false
  },
  {
    title: "Macro Counting for Beginners: A Simple Step-by-Step Guide",
    href: "blog/macro-counting-for-beginners.html",
    excerpt: "Learn how to start counting macros for weight loss or muscle gain. This beginner's guide breaks down the process into simple, easy-to-follow steps.",
    category: "nutrition",
    date: "August 27, 2025",
    readTime: "5 min read",
    featured: false
  },
  {
    title: "Beyond the Birthday Candle: A Deep Dive into Your Age",
    href: "blog/age-calculator-guide.html",
    excerpt: "Discover how to calculate your chronological age, understand its significance, and explore fun facts about time and life.",
    category: "health",
    date: "August 26, 2025",
    readTime: "5 min read",
    featured: false
  },
  {
    title: "Understanding Body Mass Index (BMI): A Comprehensive Guide",
    href: "blog/bmi-calculation-guide.html",
    excerpt: "Learn what BMI is, how to calculate it, what the ranges mean for your health, and its limitations. Use our free BMI calculator for an instant result.",
    category: "health",
    date: "August 25, 2025",
    readTime: "5 min read",
    featured: false
  },
  {
    title: "More Than the Scale: The Definitive Guide to Body Fat Percentage",
    href: "blog/body-fat-guide.html",
    excerpt: "Learn why body fat percentage is a better health indicator than BMI, explore different measurement methods, and see healthy ranges for men and women.",
    category: "fitness",
    date: "August 24, 2025",
    readTime: "6 min read",
    featured: false
  },
  {
    title: "Fueling Your Body: The Ultimate Guide to Calorie Management",
    href: "blog/calorie-calculator-guide.html",
    excerpt: "Learn what a calorie is, how to calculate your daily needs for weight loss, maintenance, or gain, and get tips for effective calorie tracking.",
    category: "nutrition",
    date: "August 23, 2025",
    readTime: "5 min read",
    featured: false
  },
  {
    title: "Decoding Your Cycle: A Guide to Periods, Fertility, and Ovulation",
    href: "blog/period-ovulation-guide.html",
    excerpt: "Understand the phases of your menstrual cycle, learn how to pinpoint your fertile window, and predict ovulation for family planning or cycle tracking.",
    category: "pregnancy",
    date: "August 22, 2025",
    readTime: "5 min read",
    featured: false
  },
  {
    title: "10 Fun Facts About Age and Time",
    href: "blog/10-fun-facts-about-age-and-time.html",
    excerpt: "Explore fascinating and fun facts about how we measure age, the concept of time, and interesting milestones in human life.",
    category: "fun-facts",
    date: "August 21, 2025",
    readTime: "4 min read",
    featured: false
  },
  {
    title: "Due Date Calculator: Track Your Pregnancy Week by Week",
    href: "blog/pregnancy-due-date-guide.html",
    excerpt: "Understand pregnancy timelines, calculate your due date accurately, and track important milestones throughout your pregnancy journey.",
    category: "pregnancy",
    date: "August 20, 2025",
    readTime: "4 min read",
    featured: false
  },
  {
    title: "Daily Water Intake: How Much Should You Really Drink?",
    href: "blog/water-intake-guide.html",
    excerpt: "Calculate your optimal daily water intake based on weight, activity level, and climate. Get personalized hydration recommendations.",
    category: "health",
    date: "August 19, 2025",
    readTime: "3 min read",
    featured: false
  },
  {
    title: "Macros Made Simple: Calculate Protein, Carbs & Fat Ratios",
    href: "blog/macro-calculator-guide.html",
    excerpt: "Master macronutrient planning with our interactive calculator. Learn optimal protein, carbohydrate, and fat ratios for your goals.",
    category: "nutrition",
    date: "August 18, 2025",
    readTime: "6 min read",
    featured: false
  }
,
{
    title: "Unlock Weight Loss: The Critical Role of Sleep in Your Health Journey",
    href: "blog/sleep-for-weight-loss.html",
    excerpt: "Sleep is often overlooked in weight loss, but it's a game-changer. Learn how getting enough rest impacts hormones, metabolism, and your journey to a healthier weight.",
    category: "HEALTH",
    date: "September 4, 2025",
    readTime: "10 min read",
    featured: false
  }
]