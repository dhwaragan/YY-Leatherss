import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, RefreshCw, GraduationCap, Gift, CreditCard, HeartHandshake } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const policies = [
  {
    id: "exchange",
    title: "Exchange Policy",
    icon: <RefreshCw className="w-5 h-5 text-gold" />,
    image: "https://res.cloudinary.com/domuelr1f/image/upload/v1783427910/returm_yidwxn.jpg",
    content: (
      <div className="space-y-4 text-sm text-neutral-600 font-sans leading-relaxed">
        <h3 className="font-serif text-xl font-bold text-neutral-800">Exchange Your Old Shoes & Save Up to ₹200</h3>
        <p>At YY Leathers, we believe your old footwear still has value.</p>
        <p>Bring any old pair of shoes (any brand) to our store and receive an exchange benefit of up to ₹200 on your new purchase from YY Leathers.</p>
        
        <h4 className="font-bold text-neutral-800 mt-6">How It Works</h4>
        <ul className="space-y-3">
          <li className="flex gap-2"><span className="text-green-600">✔️</span> Bring your old shoes while purchasing a new pair.</li>
          <li className="flex gap-2"><span className="text-green-600">✔️</span> The condition and usability of the old footwear will be assessed by our team.</li>
          <li className="flex gap-2"><span className="text-green-600">✔️</span> Based on the evaluation, customers can receive an exchange benefit ranging from ₹100 to ₹200.</li>
          <li className="flex gap-2"><span className="text-green-600">✔️</span> The exchange discount will be applied instantly to the new purchase.</li>
        </ul>
        
        <h4 className="font-bold text-neutral-800 mt-6">Terms & Conditions</h4>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Maximum exchange benefit: ₹200 per pair.</li>
          <li>Exchange value is determined solely by YY Leathers based on the condition of the footwear.</li>
          <li>Exchange benefit cannot be combined with certain promotional offers unless stated otherwise.</li>
          <li>One exchange benefit is applicable per new pair purchased.</li>
          <li>YY Leathers reserves the right to modify or discontinue the policy without prior notice.</li>
        </ul>
        
        <h4 className="font-bold text-neutral-800 mt-6">Why Exchange?</h4>
        <ul className="space-y-2">
          <li className="flex gap-3 items-center"><span>♻️</span> Reduce footwear waste and support sustainable shopping.</li>
          <li className="flex gap-3 items-center"><span>💰</span> Save money on your next pair.</li>
          <li className="flex gap-3 items-center"><span>👞</span> Upgrade to premium YY Leathers footwear at a better value.</li>
        </ul>
      </div>
    )
  },
  {
    id: "warranty",
    title: "3-Month Sole Warranty",
    icon: <ShieldCheck className="w-5 h-5 text-gold" />,
    image: "https://res.cloudinary.com/domuelr1f/image/upload/v1783428630/WhatsApp_Image_2026-07-05_at_11.53.10_PM_mtscap.jpg",
    content: (
      <div className="space-y-4 text-sm text-neutral-600 font-sans leading-relaxed">
        <p>At YY Leathers, we stand behind the durability of our footwear. Every pair purchased from YY Leathers comes with a 3-Month Sole Warranty from the date of purchase.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div className="bg-green-50 p-4 rounded-xl border border-green-100">
            <h4 className="font-bold text-neutral-800 mb-3">What Is Covered?</h4>
            <ul className="space-y-2">
              <li className="flex gap-2"><span className="text-green-600">✅</span> Sole separation from the footwear</li>
              <li className="flex gap-2"><span className="text-green-600">✅</span> Sole breakage due to manufacturing defects</li>
              <li className="flex gap-2"><span className="text-green-600">✅</span> Bottom/sole-related structural failures</li>
            </ul>
          </div>
          
          <div className="bg-red-50 p-4 rounded-xl border border-red-100">
            <h4 className="font-bold text-neutral-800 mb-3">What Is Not Covered?</h4>
            <ul className="space-y-2">
              <li className="flex gap-2"><span className="text-red-500">❌</span> Side stitching damage or thread wear</li>
              <li className="flex gap-2"><span className="text-red-500">❌</span> Upper leather damage, cuts, scratches, cracks, or tears</li>
              <li className="flex gap-2"><span className="text-red-500">❌</span> Normal wear and tear from regular usage</li>
              <li className="flex gap-2"><span className="text-red-500">❌</span> Damage caused by misuse, accidents, water exposure, chemicals, or improper care</li>
              <li className="flex gap-2"><span className="text-red-500">❌</span> Cosmetic changes such as creases, color fading, or scuff marks</li>
            </ul>
          </div>
        </div>

        <h4 className="font-bold text-neutral-800 mt-6">Warranty Claim Process</h4>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li>Visit the YY Leathers store with the footwear.</li>
          <li>Present the purchase bill or proof of purchase.</li>
          <li>Our team will inspect the footwear and verify the warranty eligibility.</li>
          <li>If the issue falls under the sole warranty coverage, repair or replacement support will be provided at YY Leathers’ discretion.</li>
        </ol>

        <div className="mt-6 p-4 bg-neutral-100 rounded-lg border border-neutral-200">
          <h4 className="font-bold text-neutral-800 mb-1">Important Note</h4>
          <p>The 3-Month Warranty is strictly applicable only to the bottom sole of the footwear. Damages related to stitching, upper leather, lining, accessories, or other components are not covered under this warranty. YY Leathers reserves the right to inspect and determine warranty eligibility for all claims.</p>
        </div>
      </div>
    )
  },
  {
    id: "student",
    title: "College Student Benefit",
    icon: <GraduationCap className="w-5 h-5 text-gold" />,
    image: "https://res.cloudinary.com/domuelr1f/image/upload/v1783427910/student_nlpuaz.jpg",
    content: (
      <div className="space-y-4 text-sm text-neutral-600 font-sans leading-relaxed">
        <p>At YY Leathers, we support students by making premium footwear more affordable.</p>
        
        <div className="bg-gradient-to-r from-neutral-800 to-leather-dark p-6 text-white rounded-xl shadow-lg my-6">
          <h3 className="font-serif text-2xl font-bold mb-2">🎓 Student Discount</h3>
          <p className="text-lg text-gold font-bold">Flat ₹100 OFF on eligible YY Leathers footwear.</p>
        </div>
        
        <h4 className="font-bold text-neutral-800 mt-6 text-base">Eligibility</h4>
        <p>To avail this benefit, students must:</p>
        <ul className="space-y-2 mt-2">
          <li className="flex gap-2 items-center"><span className="text-green-600">✅</span> Present a valid College ID Card</li>
          <li className="flex gap-2 items-center"><span className="text-green-600">✅</span> The ID card must clearly show the student’s details</li>
          <li className="flex gap-2 items-center"><span className="text-green-600">✅</span> The ID card must be valid for the current academic year</li>
        </ul>
        
        <h4 className="font-bold text-neutral-800 mt-6 text-base">Terms & Conditions</h4>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Flat ₹100 discount is applicable on eligible products only.</li>
          <li>A valid current-year college ID must be shown at the time of purchase.</li>
          <li>One student benefit can be availed per purchase.</li>
          <li>This offer cannot be combined with certain promotional offers unless otherwise specified.</li>
          <li>YY Leathers reserves the right to verify student credentials before granting the discount.</li>
        </ul>
        
        <div className="mt-6 text-center bg-gold/10 p-5 rounded-lg border border-gold/20">
          <h4 className="font-bold text-leather-dark text-lg mb-1 italic">Study Smart. Walk Smart.</h4>
          <p>Present your valid college ID and enjoy Flat ₹100 OFF on your purchase at YY Leathers.</p>
        </div>
      </div>
    )
  },
  {
    id: "birthday",
    title: "Birthday Benefit",
    icon: <Gift className="w-5 h-5 text-gold" />,
    image: "https://res.cloudinary.com/domuelr1f/image/upload/v1783427910/brithday_ynb8wv.jpg",
    content: (
      <div className="space-y-4 text-sm text-neutral-600 font-sans leading-relaxed">
        <p>Celebrate your special day with YY Leathers!</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <div className="bg-leather-dark p-5 rounded-xl border border-gold/30 text-white shadow-md">
            <h4 className="font-bold text-gold uppercase tracking-wider text-[10px] mb-2">Offline Store Purchases</h4>
            <p className="text-lg font-serif">🎉 Flat ₹500 OFF from the MRP price</p>
          </div>
          <div className="bg-neutral-800 p-5 rounded-xl border border-neutral-700 text-white shadow-md">
            <h4 className="font-bold text-neutral-400 uppercase tracking-wider text-[10px] mb-2">Online Purchases</h4>
            <p className="text-lg font-serif">🎉 Flat ₹250 OFF from the MRP price</p>
          </div>
        </div>
        
        <h4 className="font-bold text-neutral-800 mt-6 text-base">Eligibility</h4>
        <p>To avail the Birthday Benefit, customers must provide a valid Government-issued ID as proof of date of birth. Accepted IDs may include:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Aadhaar Card</li>
          <li>Driving Licence</li>
          <li>Passport</li>
          <li>Voter ID</li>
          <li>Any other Government-issued ID displaying the date of birth</li>
        </ul>
        
        <h4 className="font-bold text-neutral-800 mt-6 text-base">Terms & Conditions</h4>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Discount is applicable only on the customer’s birthday.</li>
          <li>Valid Government ID proof must be presented for verification.</li>
          <li>Offline customers are eligible for Flat ₹500 OFF from the MRP price.</li>
          <li>Online customers are eligible for Flat ₹250 OFF from the MRP price.</li>
          <li>The benefit is applicable on eligible YY Leathers products only.</li>
          <li>One Birthday Benefit can be availed per customer per year.</li>
          <li>This offer may not be combined with certain promotional offers unless otherwise specified.</li>
          <li>YY Leathers reserves the right to verify documents and determine eligibility.</li>
        </ul>

        <div className="mt-6 text-center italic">
          <h4 className="font-serif text-xl text-neutral-800 mb-1">Your Birthday Deserves Better Footwear</h4>
          <p>Shop with YY Leathers on your birthday and enjoy exclusive savings as our gift to you!</p>
        </div>
      </div>
    )
  },
  {
    id: "loyalty",
    title: "Loyalty Card Program",
    icon: <CreditCard className="w-5 h-5 text-gold" />,
    image: "https://res.cloudinary.com/domuelr1f/image/upload/v1783427909/localy_zl8mib.jpg",
    content: (
      <div className="space-y-4 text-sm text-neutral-600 font-sans leading-relaxed">
        <p>At YY Leathers, every purchase brings you closer to exclusive rewards. Collect punches on your Loyalty Card and unlock exciting benefits.</p>
        
        <h4 className="font-bold text-neutral-800 mt-4 text-base">How It Works</h4>
        <p>Receive one punch on your Loyalty Card for every eligible purchase made at YY Leathers.</p>
        
        <div className="space-y-4 my-6">
          <div className="bg-white border-2 border-dashed border-gold/40 p-5 rounded-xl shadow-sm relative overflow-hidden">
            <div className="absolute -right-6 -top-6 bg-gold text-white font-bold w-16 h-16 flex items-end justify-center rounded-full pb-2 pl-2 rotate-12 text-sm z-10">5th</div>
            <h4 className="font-bold text-neutral-800 text-lg mb-1 relative z-20">5th Punch Reward</h4>
            <p className="text-green-700 font-bold mb-2 relative z-20">🎉 Flat 50% OFF on your purchase.</p>
            <p className="text-xs text-neutral-500 relative z-20">Important: The 50% discount is calculated on the MRP (Maximum Retail Price) of the product and not on the selling price or any discounted price.</p>
          </div>

          <div className="bg-leather-dark border-2 border-leather-dark p-5 rounded-xl shadow-md text-white relative flex flex-col justify-center overflow-hidden">
             <div className="absolute -right-6 -top-6 bg-white text-leather-dark font-bold w-16 h-16 flex items-end justify-center rounded-full pb-2 pl-2 shadow-lg rotate-12 text-sm z-10">10th</div>
            <h4 className="font-bold text-gold text-lg mb-1 relative z-20">10th Punch Reward</h4>
            <p className="font-bold mb-2 relative z-20">🎁 Get a product worth up to ₹1,000 MRP absolutely FREE.</p>
            <p className="text-xs text-neutral-300 relative z-20">Customers may choose any eligible YY Leathers product with an MRP of ₹1,000 or below.</p>
          </div>
        </div>
        
        <h4 className="font-bold text-neutral-800 mt-6 text-base">Terms & Conditions</h4>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>One punch is awarded per eligible purchase.</li>
          <li>Loyalty Card rewards are non-transferable.</li>
          <li>The 5th Punch reward provides 50% OFF on the MRP price only.</li>
          <li>The 10th Punch reward is limited to one product with a maximum MRP value of ₹1,000.</li>
          <li>Rewards cannot be exchanged for cash.</li>
          <li>Lost or damaged Loyalty Cards may not be replaced.</li>
          <li>Loyalty rewards may not be combined with certain promotional offers unless otherwise specified.</li>
          <li>YY Leathers reserves the right to modify, suspend, or discontinue the Loyalty Card Program at any time.</li>
        </ul>

        <div className="mt-6 text-center font-bold text-lg text-leather-dark underline decoration-2 decoration-gold underline-offset-4">
          Shop. Collect. Save.
        </div>
        <p className="text-center text-xs">The more you shop with YY Leathers, the more rewards you earn. Start collecting your punches today!</p>
      </div>
    )
  },
  {
    id: "buyback",
    title: "Buy-Back & Upgrade Policy",
    icon: <RefreshCw className="w-5 h-5 text-gold" />,
    image: "https://res.cloudinary.com/domuelr1f/image/upload/v1783427910/nuy_nack_znzqb5.jpg",
    content: (
      <div className="space-y-4 text-sm text-neutral-600 font-sans leading-relaxed">
        <p>At YY Leathers, we believe your footwear should continue to provide value even after years of use. That’s why we offer exclusive Buy-Back and Upgrade benefits for our customers.</p>
        
        <div className="my-6 border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-neutral-50 px-5 py-3 border-b flex items-center gap-2">
            <span className="text-xl">💰</span>
            <h4 className="font-bold text-neutral-800 text-base">1. Cash-Back Policy</h4>
          </div>
          <div className="p-5">
            <p className="font-bold text-leather-dark mb-3">Get 10% Cash Back on Your Original Purchase Value</p>
            <p className="mb-4">Customers can receive a cash-back benefit of 10% of the original bill value, up to a maximum of ₹500, by surrendering their old YY Leathers footwear.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="bg-neutral-50 p-3 rounded-lg text-xs">
                 <strong className="block text-neutral-800 mb-1">Eligibility</strong>
                 <ul className="list-disc pl-4 space-y-1">
                   <li>Must be a YY Leathers product</li>
                   <li>Original purchase bill is mandatory</li>
                   <li>Must be physically surrendered</li>
                 </ul>
               </div>
               <div className="bg-neutral-50 p-3 rounded-lg text-xs">
                 <strong className="block text-neutral-800 mb-1">Benefit</strong>
                 <ul className="list-disc pl-4 space-y-1">
                   <li>10% of the original bill value</li>
                   <li>Max cash-back: ₹500</li>
                 </ul>
               </div>
            </div>
          </div>
        </div>

        <div className="my-6 border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gold/10 px-5 py-3 border-b border-gold/20 flex items-center gap-2">
            <span className="text-xl">🔄</span>
            <h4 className="font-bold text-leather-dark text-base">2. Upgrade Policy</h4>
          </div>
          <div className="p-5 bg-white">
            <p className="font-bold text-leather-dark mb-3">Upgrade Your Old YY Leathers Footwear and Save More</p>
            <p className="mb-4">Customers can receive 20% of the original bill value, up to a maximum of ₹500, as an adjustment towards the purchase of a new YY Leathers product.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="bg-neutral-50 p-3 rounded-lg text-xs">
                 <strong className="block text-neutral-800 mb-1">Eligibility</strong>
                 <ul className="list-disc pl-4 space-y-1">
                   <li>Must be a YY Leathers product</li>
                   <li>Original purchase bill is mandatory</li>
                   <li>Must be surrendered at the time of new purchase</li>
                   <li>Only valid towards a new purchase</li>
                 </ul>
               </div>
               <div className="bg-neutral-50 p-3 rounded-lg text-xs">
                 <strong className="block text-neutral-800 mb-1">Benefit</strong>
                 <ul className="list-disc pl-4 space-y-1">
                   <li>20% of the original bill value</li>
                   <li>Max upgrade benefit: ₹500</li>
                   <li>Adjusted against price of new purchase</li>
                 </ul>
               </div>
            </div>
          </div>
        </div>
        
        <h4 className="font-bold text-neutral-800 mt-6 text-base">General Terms & Conditions</h4>
        <ul className="list-disc pl-5 space-y-1.5 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
          <li>Original bill is mandatory for both Cash-Back and Upgrade benefits.</li>
          <li>Benefits are applicable only on YY Leathers products.</li>
          <li>Surrender of the old YY Leathers footwear is compulsory.</li>
          <li>Benefits are non-transferable and cannot be exchanged for cash beyond the stated Cash-Back Policy.</li>
          <li>YY Leathers reserves the right to inspect the product and verify purchase details before approving any claim.</li>
          <li>YY Leathers reserves the right to modify or discontinue these policies without prior notice.</li>
        </ul>

      </div>
    )
  }
];

export const BuybackPage: React.FC = () => {
  const [selectedPolicy, setSelectedPolicy] = useState<typeof policies[0] | null>(null);

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    if (selectedPolicy) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedPolicy]);

  return (
    <div id="policies-page-viewport" className="min-h-screen bg-neutral-50 pt-32 pb-24 select-none relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
          <span className="text-gold tracking-widest text-[10px] font-bold uppercase font-sans mb-2 block">
            The YY Leathers Difference
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-leather leading-tight">
            Why Choose Us?
          </h1>
          <p className="text-neutral-500 font-sans text-sm leading-relaxed">
            From exclusive warranties and life-time rewards to straightforward return policies and student benefits, discover what makes shopping with us a truly rewarding experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {policies.map((p, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              key={p.id}
              onClick={() => setSelectedPolicy(p)}
              className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl border border-neutral-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-overlay" />
                <img 
                  src={p.image} 
                  alt={p.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg z-20">
                  {p.icon}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-serif text-xl font-bold text-neutral-800 group-hover:text-gold transition-colors block mb-auto">
                  {p.title}
                </h3>
                <div className="mt-4 flex items-center text-xs font-bold uppercase tracking-wider text-neutral-400 group-hover:text-leather transition-colors">
                  Read Details <ArrowRight className="w-3 h-3 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      <AnimatePresence>
        {selectedPolicy && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedPolicy(null)}
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Header Image */}
              <div className="h-40 sm:h-48 relative shrink-0">
                <img src={selectedPolicy.image} alt={selectedPolicy.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 flex items-center gap-3 w-full">
                  <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-lg border border-white/20">
                    {selectedPolicy.icon}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                    {selectedPolicy.title}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedPolicy(null)}
                  className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Content Body */}
              <div className="p-6 sm:p-8 overflow-y-auto no-scrollbar scroll-smooth flex-1">
                {selectedPolicy.content}
              </div>
              
              {/* Footer */}
              <div className="border-t border-neutral-100 p-4 sm:p-6 bg-neutral-50 shrink-0 text-center sm:text-right">
                <button 
                  onClick={() => setSelectedPolicy(null)}
                  className="bg-leather hover:bg-gold text-white font-sans text-xs uppercase tracking-widest font-bold py-3 px-8 rounded shadow-md transition-colors cursor-pointer w-full sm:w-auto"
                >
                  Close Information
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

