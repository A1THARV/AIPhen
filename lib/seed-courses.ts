import { getSupabaseServer } from "./supabase-server"
import { crypto } from "crypto"

export async function seedCourses() {
  try {
    const supabase = getSupabaseServer()

    // Check if courses already exist
    const { data: existingCourses } = await supabase.from("courses").select("id").limit(1)

    if (existingCourses && existingCourses.length > 0) {
      console.log("Courses already exist, skipping seed")
      return { success: true, message: "Courses already exist" }
    }

    // Generate UUIDs for courses
    const courseIds = [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()]

    // Insert courses
    const { data: courses, error: coursesError } = await supabase
      .from("courses")
      .insert([
        {
          id: courseIds[0],
          title: "Financial Fundamentals",
          description: "Learn the basics of personal finance, budgeting, and money management.",
          difficulty: "beginner",
          duration: "4 weeks",
          thumbnail: "/placeholder.svg?height=200&width=300",
          is_published: true,
          created_at: new Date().toISOString(),
        },
        {
          id: courseIds[1],
          title: "Investment Strategies",
          description: "Discover different investment approaches and build a diversified portfolio.",
          difficulty: "intermediate",
          duration: "6 weeks",
          thumbnail: "/placeholder.svg?height=200&width=300",
          is_published: true,
          created_at: new Date().toISOString(),
        },
        {
          id: courseIds[2],
          title: "Retirement Planning",
          description: "Plan for your future with comprehensive retirement strategies.",
          difficulty: "intermediate",
          duration: "5 weeks",
          thumbnail: "/placeholder.svg?height=200&width=300",
          is_published: true,
          created_at: new Date().toISOString(),
        },
        {
          id: courseIds[3],
          title: "Advanced Trading",
          description: "Master advanced trading techniques and market analysis.",
          difficulty: "advanced",
          duration: "8 weeks",
          thumbnail: "/placeholder.svg?height=200&width=300",
          is_published: true,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (coursesError) {
      console.error("Error inserting courses:", coursesError)
      return { success: false, error: coursesError }
    }

    // Generate UUIDs for modules
    const moduleIds = [
      // Course 1 modules
      crypto.randomUUID(),
      crypto.randomUUID(),
      crypto.randomUUID(),
      // Course 2 modules
      crypto.randomUUID(),
      crypto.randomUUID(),
      crypto.randomUUID(),
      // Course 3 modules
      crypto.randomUUID(),
      crypto.randomUUID(),
      // Course 4 modules
      crypto.randomUUID(),
      crypto.randomUUID(),
    ]

    // Insert modules
    const { data: modules, error: modulesError } = await supabase
      .from("modules")
      .insert([
        // Financial Fundamentals modules
        {
          id: moduleIds[0],
          course_id: courseIds[0],
          title: "Introduction to Personal Finance",
          description: "Understanding the basics of money management",
          order_index: 1,
          estimated_duration: "1 week",
          created_at: new Date().toISOString(),
        },
        {
          id: moduleIds[1],
          course_id: courseIds[0],
          title: "Budgeting and Saving",
          description: "Creating and maintaining a budget",
          order_index: 2,
          estimated_duration: "1 week",
          created_at: new Date().toISOString(),
        },
        {
          id: moduleIds[2],
          course_id: courseIds[0],
          title: "Debt Management",
          description: "Strategies for managing and eliminating debt",
          order_index: 3,
          estimated_duration: "2 weeks",
          created_at: new Date().toISOString(),
        },
        // Investment Strategies modules
        {
          id: moduleIds[3],
          course_id: courseIds[1],
          title: "Investment Basics",
          description: "Understanding different types of investments",
          order_index: 1,
          estimated_duration: "2 weeks",
          created_at: new Date().toISOString(),
        },
        {
          id: moduleIds[4],
          course_id: courseIds[1],
          title: "Portfolio Diversification",
          description: "Building a balanced investment portfolio",
          order_index: 2,
          estimated_duration: "2 weeks",
          created_at: new Date().toISOString(),
        },
        {
          id: moduleIds[5],
          course_id: courseIds[1],
          title: "Risk Management",
          description: "Understanding and managing investment risks",
          order_index: 3,
          estimated_duration: "2 weeks",
          created_at: new Date().toISOString(),
        },
        // Retirement Planning modules
        {
          id: moduleIds[6],
          course_id: courseIds[2],
          title: "Retirement Basics",
          description: "Understanding retirement planning fundamentals",
          order_index: 1,
          estimated_duration: "2 weeks",
          created_at: new Date().toISOString(),
        },
        {
          id: moduleIds[7],
          course_id: courseIds[2],
          title: "401(k) and IRAs",
          description: "Maximizing retirement account benefits",
          order_index: 2,
          estimated_duration: "3 weeks",
          created_at: new Date().toISOString(),
        },
        // Advanced Trading modules
        {
          id: moduleIds[8],
          course_id: courseIds[3],
          title: "Technical Analysis",
          description: "Reading charts and market indicators",
          order_index: 1,
          estimated_duration: "4 weeks",
          created_at: new Date().toISOString(),
        },
        {
          id: moduleIds[9],
          course_id: courseIds[3],
          title: "Options and Derivatives",
          description: "Advanced trading instruments",
          order_index: 2,
          estimated_duration: "4 weeks",
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (modulesError) {
      console.error("Error inserting modules:", modulesError)
      return { success: false, error: modulesError }
    }

    // Generate UUIDs for lessons
    const lessonIds = Array.from({ length: 20 }, () => crypto.randomUUID())

    // Insert lessons
    const { data: lessons, error: lessonsError } = await supabase
      .from("lessons")
      .insert([
        // Module 1 lessons (Introduction to Personal Finance)
        {
          id: lessonIds[0],
          module_id: moduleIds[0],
          title: "What is Personal Finance?",
          description: "Understanding the scope and importance of personal finance",
          content: `
            <h3>Welcome to Personal Finance</h3>
            <p>Personal finance is the management of your money and financial decisions. It encompasses:</p>
            <ul>
              <li>Budgeting and expense tracking</li>
              <li>Saving and investing</li>
              <li>Debt management</li>
              <li>Insurance and risk management</li>
              <li>Retirement planning</li>
            </ul>
            <p>This course will guide you through each of these areas to help you build a strong financial foundation.</p>
          `,
          type: "text",
          duration: "15 min",
          order_index: 1,
          points: 10,
          is_locked: false,
          created_at: new Date().toISOString(),
        },
        {
          id: lessonIds[1],
          module_id: moduleIds[0],
          title: "Setting Financial Goals",
          description: "How to set and achieve your financial objectives",
          content: `
            <h3>SMART Financial Goals</h3>
            <p>Setting clear financial goals is crucial for success. Use the SMART framework:</p>
            <ul>
              <li><strong>Specific:</strong> Clearly define what you want to achieve</li>
              <li><strong>Measurable:</strong> Set quantifiable targets</li>
              <li><strong>Achievable:</strong> Ensure goals are realistic</li>
              <li><strong>Relevant:</strong> Align with your values and priorities</li>
              <li><strong>Time-bound:</strong> Set deadlines for achievement</li>
            </ul>
            <p>Examples of good financial goals:</p>
            <ul>
              <li>Save $10,000 for an emergency fund within 12 months</li>
              <li>Pay off $5,000 in credit card debt within 18 months</li>
              <li>Contribute 15% of income to retirement accounts</li>
            </ul>
          `,
          type: "text",
          duration: "20 min",
          order_index: 2,
          points: 15,
          is_locked: false,
          created_at: new Date().toISOString(),
        },
        // Module 2 lessons (Budgeting and Saving)
        {
          id: lessonIds[2],
          module_id: moduleIds[1],
          title: "Creating Your First Budget",
          description: "Step-by-step guide to building a personal budget",
          content: `
            <h3>The 50/30/20 Budget Rule</h3>
            <p>A simple budgeting framework to get started:</p>
            <ul>
              <li><strong>50% for Needs:</strong> Housing, utilities, groceries, minimum debt payments</li>
              <li><strong>30% for Wants:</strong> Entertainment, dining out, hobbies</li>
              <li><strong>20% for Savings & Debt:</strong> Emergency fund, retirement, extra debt payments</li>
            </ul>
            <h4>Steps to Create Your Budget:</h4>
            <ol>
              <li>Calculate your after-tax income</li>
              <li>List all your expenses</li>
              <li>Categorize expenses as needs or wants</li>
              <li>Allocate money according to the 50/30/20 rule</li>
              <li>Track and adjust as needed</li>
            </ol>
          `,
          type: "text",
          duration: "25 min",
          order_index: 1,
          points: 20,
          is_locked: false,
          created_at: new Date().toISOString(),
        },
        {
          id: lessonIds[3],
          module_id: moduleIds[1],
          title: "Emergency Fund Basics",
          description: "Building your financial safety net",
          content: `
            <h3>Why You Need an Emergency Fund</h3>
            <p>An emergency fund is money set aside for unexpected expenses like:</p>
            <ul>
              <li>Job loss or reduced income</li>
              <li>Medical emergencies</li>
              <li>Major car or home repairs</li>
              <li>Family emergencies</li>
            </ul>
            <h4>How Much to Save:</h4>
            <ul>
              <li><strong>Starter Emergency Fund:</strong> $1,000 for beginners</li>
              <li><strong>Full Emergency Fund:</strong> 3-6 months of expenses</li>
              <li><strong>Extended Fund:</strong> 6-12 months for irregular income</li>
            </ul>
            <h4>Where to Keep Your Emergency Fund:</h4>
            <ul>
              <li>High-yield savings account</li>
              <li>Money market account</li>
              <li>Short-term CDs</li>
            </ul>
          `,
          type: "text",
          duration: "18 min",
          order_index: 2,
          points: 15,
          is_locked: false,
          created_at: new Date().toISOString(),
        },
        // Module 3 lessons (Debt Management)
        {
          id: lessonIds[4],
          module_id: moduleIds[2],
          title: "Understanding Different Types of Debt",
          description: "Good debt vs bad debt and how to manage both",
          content: `
            <h3>Types of Debt</h3>
            <h4>Good Debt (Can help build wealth):</h4>
            <ul>
              <li><strong>Mortgages:</strong> Real estate typically appreciates</li>
              <li><strong>Student Loans:</strong> Education increases earning potential</li>
              <li><strong>Business Loans:</strong> Can generate income</li>
            </ul>
            <h4>Bad Debt (Decreases wealth):</h4>
            <ul>
              <li><strong>Credit Cards:</strong> High interest on consumer goods</li>
              <li><strong>Auto Loans:</strong> Cars depreciate rapidly</li>
              <li><strong>Payday Loans:</strong> Extremely high interest rates</li>
            </ul>
            <h4>Debt Management Strategies:</h4>
            <ul>
              <li>Pay minimums on all debts</li>
              <li>Focus extra payments on highest interest debt</li>
              <li>Consider debt consolidation</li>
              <li>Negotiate with creditors if needed</li>
            </ul>
          `,
          type: "text",
          duration: "22 min",
          order_index: 1,
          points: 18,
          is_locked: false,
          created_at: new Date().toISOString(),
        },
        // Investment Strategies lessons
        {
          id: lessonIds[5],
          module_id: moduleIds[3],
          title: "Introduction to Investing",
          description: "Basic concepts and types of investments",
          content: `
            <h3>Why Invest?</h3>
            <p>Investing helps your money grow faster than inflation and savings accounts.</p>
            <h4>Types of Investments:</h4>
            <ul>
              <li><strong>Stocks:</strong> Ownership shares in companies</li>
              <li><strong>Bonds:</strong> Loans to governments or corporations</li>
              <li><strong>Mutual Funds:</strong> Diversified investment pools</li>
              <li><strong>ETFs:</strong> Exchange-traded funds</li>
              <li><strong>Real Estate:</strong> Property investments</li>
            </ul>
            <h4>Risk vs Return:</h4>
            <p>Generally, higher potential returns come with higher risk. Your investment strategy should match your:</p>
            <ul>
              <li>Risk tolerance</li>
              <li>Time horizon</li>
              <li>Financial goals</li>
            </ul>
          `,
          type: "text",
          duration: "30 min",
          order_index: 1,
          points: 25,
          is_locked: false,
          created_at: new Date().toISOString(),
        },
        // Module 4 lessons (Portfolio Diversification)
        {
          id: lessonIds[6],
          module_id: moduleIds[4],
          title: "Building a Diversified Portfolio",
          description: "Learn how to spread your investments across different asset classes",
          content: `
            <h3>Why Diversify?</h3>
            <p>Diversification reduces risk by spreading investments across various assets. This lesson covers:</p>
            <ul>
              <li>Stocks</li>
              <li>Bonds</li>
              <li>Mutual Funds</li>
              <li>ETFs</li>
              <li>Real Estate</li>
            </ul>
            <h4>Steps to Diversify:</h4>
            <ol>
              <li>Assess your risk tolerance</li>
              <li>Research different asset classes</li>
              <li>Allocate funds accordingly</li>
              <li>Regularly rebalance your portfolio</li>
            </ol>
          `,
          type: "text",
          duration: "25 min",
          order_index: 2,
          points: 20,
          is_locked: false,
          created_at: new Date().toISOString(),
        },
        // Module 5 lessons (Risk Management)
        {
          id: lessonIds[7],
          module_id: moduleIds[5],
          title: "Understanding Investment Risk",
          description: "Identify and assess risks in your investment portfolio",
          content: `
            <h3>Common Investment Risks</h3>
            <ul>
              <li><strong>Market Risk:</strong> Fluctuations in stock prices</li>
              <li><strong>Credit Risk:</strong> Risk of default by borrowers</li>
              <li><strong>Liquidity Risk:</strong> Difficulty selling investments</li>
              <li><strong>Inflation Risk:</strong> Loss of purchasing power</li>
            </ul>
            <h4>Managing Risk:</h4>
            <ul>
              <li>Research thoroughly</li>
              <li>Diversify investments</li>
              <li>Set stop-loss orders</li>
              <li>Consult with financial advisors</li>
            </ul>
          `,
          type: "text",
          duration: "20 min",
          order_index: 1,
          points: 15,
          is_locked: false,
          created_at: new Date().toISOString(),
        },
        // Module 6 lessons (Retirement Basics)
        {
          id: lessonIds[8],
          module_id: moduleIds[6],
          title: "Retirement Planning Basics",
          description: "Start planning for your retirement today",
          content: `
            <h3>Why Plan for Retirement?</h3>
            <p>Retirement planning ensures you have enough money to live comfortably after working. This lesson covers:</p>
            <ul>
              <li>Understanding retirement needs</li>
              <li>Setting retirement goals</li>
              <li>Choosing retirement accounts</li>
            </ul>
            <h4>Steps to Plan:</h4>
            <ol>
              <li>Estimate retirement expenses</li>
              <li>Calculate how much you need to save</li>
              <li>Choose appropriate retirement accounts</li>
              <li>Start saving early</li>
            </ol>
          `,
          type: "text",
          duration: "20 min",
          order_index: 1,
          points: 15,
          is_locked: false,
          created_at: new Date().toISOString(),
        },
        // Module 7 lessons (401(k) and IRAs)
        {
          id: lessonIds[9],
          module_id: moduleIds[7],
          title: "Maximizing Retirement Accounts",
          description: "Learn how to use 401(k)s and IRAs effectively",
          content: `
            <h3>401(k)s and IRAs</h3>
            <ul>
              <li><strong>401(k):</strong> Employer-sponsored retirement plan</li>
              <li><strong>IRA:</strong> Individual retirement account</li>
            </ul>
            <h4>Benefits:</h4>
            <ul>
              <li>Tax-deferred growth</li>
              <li>Employer matching contributions</li>
              <li>Flexibility in withdrawal options</li>
            </ul>
            <h4>How to Use:</h4>
            <ul>
              <li>Contribute regularly</li>
              <li>Choose diversified investments</li>
              <li>Consider Roth options for tax-free growth</li>
            </ul>
          `,
          type: "text",
          duration: "25 min",
          order_index: 2,
          points: 20,
          is_locked: false,
          created_at: new Date().toISOString(),
        },
        // Module 8 lessons (Technical Analysis)
        {
          id: lessonIds[10],
          module_id: moduleIds[8],
          title: "Introduction to Technical Analysis",
          description: "Learn how to use charts and indicators to make trading decisions",
          content: `
            <h3>Technical Analysis</h3>
            <p>Technical analysis uses historical price and volume data to predict future price movements. This lesson covers:</p>
            <ul>
              <li>Charts and indicators</li>
              <li>Trend analysis</li>
              <li>Support and resistance levels</li>
            </ul>
            <h4>Getting Started:</h4>
            <ul>
              <li>Choose a trading platform</li>
              <li>Learn basic chart patterns</li>
              <li>Practice with simulated trades</li>
            </ul>
          `,
          type: "text",
          duration: "25 min",
          order_index: 1,
          points: 20,
          is_locked: false,
          created_at: new Date().toISOString(),
        },
        // Module 9 lessons (Options and Derivatives)
        {
          id: lessonIds[11],
          module_id: moduleIds[9],
          title: "Understanding Options",
          description: "Learn about call and put options",
          content: `
            <h3>Options</h3>
            <ul>
              <li><strong>Call Options:</strong> Right to buy an asset at a specified price</li>
              <li><strong>Put Options:</strong> Right to sell an asset at a specified price</li>
            </ul>
            <h4>Benefits:</h4>
            <ul>
              <li>Leverage potential gains</li>
              <li>Protect against price declines</li>
              <li>Generate income through premiums</li>
            </ul>
            <h4>Risks:</h4>
            <ul>
              <li>Limited upside potential</li>
              <li>High risk of loss</li>
              <li>Requires careful analysis</li>
            </ul>
          `,
          type: "text",
          duration: "20 min",
          order_index: 1,
          points: 15,
          is_locked: false,
          created_at: new Date().toISOString(),
        },
        {
          id: lessonIds[12],
          module_id: moduleIds[9],
          title: "Using Derivatives",
          description: "Explore other derivative instruments like futures and swaps",
          content: `
            <h3>Derivatives</h3>
            <ul>
              <li><strong>Futures:</strong> Contracts to buy or sell assets at a future date</li>
              <li><strong>Swaps:</strong> Agreements to exchange cash flows</li>
            </ul>
            <h4>Benefits:</h4>
            <ul>
              <li>Hedging against price risk</li>
              <li>Speculating on price movements</li>
              <li>Generating income through premiums</li>
            </ul>
            <h4>Risks:</h4>
            <ul>
              <li>Limited upside potential</li>
              <li>High risk of loss</li>
              <li>Requires careful analysis</li>
            </ul>
          `,
          type: "text",
          duration: "25 min",
          order_index: 2,
          points: 20,
          is_locked: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (lessonsError) {
      console.error("Error inserting lessons:", lessonsError)
      return { success: false, error: lessonsError }
    }

    // Generate UUIDs for badges
    const badgeIds = [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()]

    // Insert badges
    const { data: badges, error: badgesError } = await supabase
      .from("badges")
      .insert([
        {
          id: badgeIds[0],
          name: "First Steps",
          description: "Complete your first lesson",
          icon: "🎯",
          points_required: 10,
          created_at: new Date().toISOString(),
        },
        {
          id: badgeIds[1],
          name: "Budget Master",
          description: "Complete the budgeting module",
          icon: "💰",
          points_required: 50,
          created_at: new Date().toISOString(),
        },
        {
          id: badgeIds[2],
          name: "Investment Rookie",
          description: "Complete your first investment lesson",
          icon: "📈",
          points_required: 100,
          created_at: new Date().toISOString(),
        },
        {
          id: badgeIds[3],
          name: "Course Completion",
          description: "Complete an entire course",
          icon: "🏆",
          points_required: 200,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (badgesError) {
      console.error("Error inserting badges:", badgesError)
      return { success: false, error: badgesError }
    }

    return {
      success: true,
      message: "Database seeded successfully",
      data: {
        courses: courses?.length || 0,
        modules: modules?.length || 0,
        lessons: lessons?.length || 0,
        badges: badges?.length || 0,
      },
    }
  } catch (error) {
    console.error("Error seeding database:", error)
    return { success: false, error }
  }
}
