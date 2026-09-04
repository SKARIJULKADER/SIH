// src/components/landing/Testimonials.tsx
// Success stories / testimonials with ratings and avatars.
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { RatingStars } from '@/components/ui/RatingStars'
import { Reveal } from './Reveal'

const stories = [
  {
    name: 'Priya Sharma',
    role: 'SDE at Microsoft',
    tag: 'Placed · Software Engineer',
    img: 'https://i.pravatar.cc/80?img=47',
    rating: 5,
    quote: 'The skill gap analyzer showed me exactly what to learn for my target role. Six months of focused prep later, I had the offer in hand.',
  },
  {
    name: 'Rahul Verma',
    role: 'Data Analyst at Accenture',
    tag: 'Placed · Data Analyst',
    img: 'https://i.pravatar.cc/80?img=12',
    rating: 5,
    quote: 'Mock interviews tracked my progress from 58% to 81%. Watching the improvement curve kept me going when prep felt endless.',
  },
  {
    name: 'Ankita Das',
    role: 'Cloud Intern at DevStart',
    tag: 'Internship · Cloud',
    img: 'https://i.pravatar.cc/80?img=45',
    rating: 4.5,
    quote: 'I found my internship through DigiSpark and prepared for every round with the company-specific guides. The whole flow just works.',
  },
]

export const Testimonials = () => {
  return (
    <section className="py-20 lg:py-24 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-growth-3 bg-growth-soft rounded-full px-4 py-1.5">Success Stories</span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">From Learning to Placement</h2>
          <p className="mt-4 text-lg text-slate-600">Real students. Real journeys. Real offers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((s, i) => (
            <Reveal key={s.name} delay={i * 90} className="h-full">
              <div className="h-full flex flex-col bg-white rounded-2xl border border-slate-200 p-7 shadow-soft hover:shadow-lift hover:-translate-y-1 transition-all duration-300">
                <RatingStars rating={s.rating} />
                <p className="mt-4 text-slate-700 leading-relaxed flex-1">"{s.quote}"</p>
                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                  <Avatar className="w-11 h-11">
                    <AvatarImage src={s.img} alt={s.name} />
                    <AvatarFallback>{s.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-[15px]">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.role}</p>
                  </div>
                </div>
                <span className="mt-4 w-fit text-xs font-bold text-growth-3 bg-growth-soft rounded-full px-3 py-1">{s.tag}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
