'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, ShoppingBag, ShieldCheck, Zap } from 'lucide-react'
import Image from 'next/image'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-24 md:pt-24 md:pb-32 lg:pt-32 lg:pb-40">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-accent/5 blur-[100px] rounded-full" />

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-left max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 border border-primary/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure Campus Trading
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Buy & Sell <br />
              <span className="text-primary italic">Smarter</span> On Campus.
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 md:mb-10 max-w-lg leading-relaxed">
              Secure transactions. Verified students. No strangers. The premium marketplace built exclusively for your university community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-full px-10 h-12 md:h-14 text-sm md:text-base shadow-button group" asChild>
                <Link href="/sell">
                  Start Selling
                  <Zap className="ml-2 h-4 w-4 fill-current group-hover:scale-125 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-10 h-12 md:h-14 text-sm md:text-base border-2 hover:bg-muted" asChild>
                <Link href="/browse">
                  Browse Listings
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 md:mt-12 flex items-center gap-6 md:gap-8 grayscale opacity-60">
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold">1k+</span>
                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider">Active Students</span>
              </div>
              <div className="border-l h-8 border-border" />
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold">500+</span>
                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider">Deals Closed</span>
              </div>
            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="relative h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center"
          >
             {/* Floating Composition */}
             <motion.div 
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
               className="relative w-full h-full flex items-center justify-center"
             >
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-card rotate-6 flex items-center justify-center overflow-hidden border group/hero">
                   <div className="absolute inset-0 bg-linear-to-tr from-primary/10 to-transparent z-10" />
                   <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                      <ShoppingBag className="h-24 w-24 md:h-32 md:w-32 text-primary/10" />
                   </div>
                   <Image 
                     src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop" 
                     alt="Campus Essentials" 
                     fill 
                     className="object-cover transition-transform duration-700 group-hover/hero:scale-110"
                     priority
                   />
                </div>
                
                {/* Decorative floating badges */}
                <motion.div 
                   animate={{ x: [0, 10, 0], y: [0, 15, 0] }}
                   transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                   className="absolute top-12 -left-2 md:top-1/4 md:-left-4 bg-white p-2.5 md:p-4 rounded-xl md:rounded-2xl shadow-card border flex items-center gap-2 md:gap-3"
                >
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-accent/20 flex items-center justify-center text-accent-foreground">
                    <Zap className="h-4 w-4 md:h-5 md:w-5 fill-current" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] md:text-xs font-bold">Quick Sale</span>
                    <span className="text-[8px] md:text-[10px] text-muted-foreground">Sold in 2h</span>
                  </div>
                </motion.div>

                <motion.div 
                   animate={{ x: [0, -10, 0], y: [0, -15, 0] }}
                   transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                   className="absolute bottom-12 -right-2 md:bottom-1/4 md:-right-8 bg-white p-2.5 md:p-4 rounded-xl md:rounded-2xl shadow-card border flex items-center gap-2 md:gap-3"
                >
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] md:text-xs font-bold">Verified</span>
                    <span className="text-[8px] md:text-[10px] text-muted-foreground">Student ID Checked</span>
                  </div>
                </motion.div>

             </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
