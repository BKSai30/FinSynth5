'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei'
import { useAuthStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Brain, TrendingUp, Users, Zap, Shield, Globe } from 'lucide-react'
import Link from 'next/link'

// 3D Animated Sphere Component
function AnimatedSphere() {
  return (
    <Sphere visible args={[1, 100, 200]} scale={2.4}>
      <MeshDistortMaterial
        color="#3b82f6"
        attach="material"
        distort={0.3}
        speed={1.5}
        roughness={0}
      />
    </Sphere>
  )
}

export default function HomePage() {
  const { user } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">FinSynth</span>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  🚀 Hackathon Project
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Transform Financial Planning with{' '}
                  <span className="gradient-text">AI-Powered</span> Forecasting
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  Ask questions, get insights. Our AI converts natural language queries into 
                  structured financial forecasts for SaaS companies.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={user ? "/dashboard" : "/auth/register"}>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6 pulse-glow"
                  >
                    Start Forecasting
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">12+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Months Forecast</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">2</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Business Units</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">AI</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Powered</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - 3D Animation */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-96 lg:h-[500px]"
            >
              <Canvas>
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <AnimatedSphere />
              </Canvas>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 glass-effect p-4 rounded-lg"
              >
                <TrendingUp className="w-6 h-6 text-green-500" />
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 left-10 glass-effect p-4 rounded-lg"
              >
                <Users className="w-6 h-6 text-blue-500" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl font-bold">Autonomous Finance Modeler</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Turn your questions into financial forecasts. Powered by AI and built for modern SaaS companies.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Analysis",
                description: "Natural language processing converts your questions into structured financial models."
              },
              {
                icon: TrendingUp,
                title: "Real-time Forecasting",
                description: "Generate accurate revenue forecasts for both large enterprise and SMB customers."
              },
              {
                icon: Users,
                title: "Dual Business Model",
                description: "Supports both enterprise sales and SMB marketing-driven acquisition models."
              },
              {
                icon: Zap,
                title: "Instant Insights",
                description: "Get immediate answers to complex financial questions with detailed breakdowns."
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Built with Supabase for enterprise-grade security and data protection."
              },
              {
                icon: Globe,
                title: "Modern Interface",
                description: "Beautiful, responsive design with dark mode and 3D animations."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold">Ready to Transform Your Financial Planning?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Join the future of AI-powered financial forecasting. Start with a simple question.
            </p>
            <Link href={user ? "/dashboard" : "/auth/register"}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-12 py-6"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">FinSynth Hackathon</span>
          </div>
          <p className="text-slate-400">
            AI-Powered Financial Forecasting Platform
          </p>
        </div>
      </footer>
    </div>
  )
}
