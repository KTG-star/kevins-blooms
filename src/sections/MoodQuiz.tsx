import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Sun, Moon, CloudRain, Smile, Frown, MessageSquare, ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOODS = [
  {
    id: 'happy',
    label: 'Happy',
    icon: <Smile className="text-yellow-500" />,
    subOptions: [
      { label: 'Celebrating', recommendations: ['Sunflowers', 'Yellow Sunshine Rose', 'Daisies'], category: 'Classic' },
      { label: 'In Love', recommendations: ['Yellow Sunshine Rose', 'Sunflowers'], category: 'Roses' },
      { label: 'Grateful', recommendations: ['Daisies', 'Sunflowers'], category: 'Classic' },
      { label: 'Excited', recommendations: ['Sunflowers', 'Gerbera Daisies'], category: 'Classic' }
    ]
  },
  {
    id: 'sad',
    label: 'Sad',
    icon: <Frown className="text-blue-500" />,
    subOptions: [
      { label: 'Grieving', recommendations: ['White Ivory Rose', 'Lilies'], category: 'Classic' },
      { label: 'Lonely', recommendations: ['Lavender Rose', 'Lilies'], category: 'Roses' },
      { label: 'Heartbroken', recommendations: ['Blue Iris', 'White Ivory Rose'], category: 'Classic' },
      { label: 'Stressed', recommendations: ['Lavender Rose', 'White Ivory Rose'], category: 'Roses' }
    ]
  },
  {
    id: 'romantic',
    label: 'Romantic',
    icon: <Heart className="text-pink-500" />,
    subOptions: [
      { label: 'Anniversary', recommendations: ['Red Velvet Rose', 'Peonies'], category: 'Roses' },
      { label: 'First Date', recommendations: ['Red Tulips', 'Pink Blush Rose'], category: 'Classic' },
      { label: 'Proposal', recommendations: ['Red Velvet Rose', 'Peonies'], category: 'Roses' },
      { label: 'Apology', recommendations: ['White Ivory Rose', 'Pink Blush Rose'], category: 'Roses' }
    ]
  },
  {
    id: 'thoughtful',
    label: 'Thoughtful',
    icon: <MessageSquare className="text-purple-500" />,
    subOptions: [
      { label: 'Get Well Soon', recommendations: ['Mixed Bouquets', 'Orchids'], category: 'Bouquets' },
      { label: 'Thank You', recommendations: ['Chrysanthemums', 'Mixed Bouquets'], category: 'Seasonal' },
      { label: 'Thinking of You', recommendations: ['Orchids', 'Anthurium'], category: 'Tropical' },
      { label: 'Condolence', recommendations: ['White Ivory Rose', 'Lilies'], category: 'Classic' }
    ]
  }
];

const MoodQuiz = () => {
  const [step, setStep] = useState(0); // 0: Mood selection, 1: Sub-option selection
  const [selectedMood, setSelectedMood] = useState<any>(null);
  const [selectedSubOption, setSelectedSubOption] = useState<any>(null);

  const handleMoodSelect = (mood: any) => {
    setSelectedMood(mood);
    setStep(1);
  };

  const handleSubOptionSelect = (subOption: any) => {
    setSelectedSubOption(subOption);
    setStep(2);
  };

  const resetQuiz = () => {
    setStep(0);
    setSelectedMood(null);
    setSelectedSubOption(null);
  };

  return (
    <section className="py-32 px-6 bg-bloom-cream overflow-hidden">
      <div className="max-w-4xl mx-auto glass p-8 md:p-24 rounded-[3rem] relative min-h-0 md:min-h-[600px] flex flex-col justify-center">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Sparkles size={200} />
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center relative z-10"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-bloom-pink font-bold mb-6 italic">Step 1 of 2</p>
              <h2 className="text-4xl md:text-6xl font-cormorant text-bloom-green mb-12">How are you feeling today?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {MOODS.map((mood) => (
                  <motion.button
                    key={mood.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleMoodSelect(mood)}
                    className="p-8 rounded-3xl bg-white/50 border border-bloom-green/5 hover:border-bloom-pink transition-all flex items-center gap-6 text-left group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:bg-bloom-pink group-hover:text-white transition-colors">
                      {React.cloneElement(mood.icon as React.ReactElement, { size: 32 })}
                    </div>
                    <span className="text-2xl font-cormorant font-bold text-bloom-green">{mood.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center relative z-10"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-bloom-pink font-bold mb-6 italic">Step 2 of 2</p>
              <h2 className="text-4xl md:text-6xl font-cormorant text-bloom-green mb-12 italic">Tell us more...</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {selectedMood.subOptions.map((sub: any, i: number) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSubOptionSelect(sub)}
                    className="p-8 rounded-3xl bg-white/50 border border-bloom-green/5 hover:border-bloom-pink transition-all flex items-center justify-between text-left group"
                  >
                    <span className="text-2xl font-cormorant font-bold text-bloom-green">{sub.label}</span>
                    <ArrowRight className="text-bloom-pink opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </div>
              <button onClick={() => setStep(0)} className="mt-12 flex items-center gap-2 mx-auto text-bloom-green/60 hover:text-bloom-green transition-colors">
                <RotateCcw size={16} /> Back to moods
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center relative z-10"
            >
              <Sparkles className="text-bloom-gold mx-auto mb-8 animate-pulse" size={64} />
              <h2 className="text-3xl font-cormorant text-bloom-green/60 mb-2 italic">Because you are feeling {selectedMood.label}...</h2>
              <h3 className="text-5xl md:text-7xl font-cormorant text-bloom-green mb-8">We recommend</h3>
              
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {selectedSubOption.recommendations.map((rec: string, i: number) => (
                  <span key={i} className="px-6 py-2 rounded-full bg-bloom-pink/10 text-bloom-pink font-bold text-lg border border-bloom-pink/20">
                    {rec}
                  </span>
                ))}
              </div>

              <Link to={`/shop?category=${selectedSubOption.category}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-bloom-green text-white px-12 py-5 rounded-full font-bold text-lg shadow-xl shadow-bloom-green/20 flex items-center gap-3 mx-auto"
                >
                  Shop These Blooms <ArrowRight size={20} />
                </motion.button>
              </Link>
              
              <button 
                onClick={resetQuiz}
                className="mt-12 flex items-center gap-2 mx-auto text-bloom-green/40 hover:text-bloom-green transition-colors font-medium"
              >
                <RotateCcw size={16} /> Start Over
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MoodQuiz;
