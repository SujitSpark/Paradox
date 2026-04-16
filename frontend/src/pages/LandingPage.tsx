import { Link, useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="scroll-smooth bg-background text-on-surface font-body selection:bg-secondary-fixed selection:text-on-secondary-fixed relative h-screen overflow-y-auto">

{/* TopAppBar */}
<header className="fixed top-0 w-full z-50 bg-[#fcf9f4]/85 backdrop-blur-md shadow-[0_4px_24px_-4px_rgba(28,28,25,0.06)]">
<nav className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
<div className="font-serif text-2xl font-bold text-[#00003c] tracking-tighter Newsreader">JudicAI</div>
<div className="hidden md:flex items-center space-x-10">
<a className="font-serif text-lg tracking-tight Newsreader text-[#00003c] border-b-2 border-[#735c00] pb-1 transition-colors duration-300" href="#solutions">Solutions</a>
<a className="font-serif text-lg tracking-tight Newsreader text-[#1c1c19]/70 hover:text-[#00003c] transition-colors duration-300" href="#methodology">Methodology</a>
<a className="font-serif text-lg tracking-tight Newsreader text-[#1c1c19]/70 hover:text-[#00003c] transition-colors duration-300" href="#security">Security</a>
<a className="font-serif text-lg tracking-tight Newsreader text-[#1c1c19]/70 hover:text-[#00003c] transition-colors duration-300" href="#resources">Resources</a>
</div>
<div className="flex items-center space-x-6">
<button onClick={() => navigate('/login')} className="hidden lg:block text-[#1c1c19]/70 hover:text-[#00003c] font-medium transition-all">Login</button>
<button onClick={() => navigate('/dashboard')} className="bg-primary text-secondary-fixed px-6 py-2.5 rounded-sm font-semibold text-sm hover:opacity-90 transition-all shadow-sm">Request Access</button>
</div>
</nav>
</header>
<main className="pt-20">
{/* Hero Section */}
<section className="relative min-h-[870px] flex items-center overflow-hidden bg-surface py-20 px-8">
<div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
<div className="z-10">
<span className="inline-block label-sm tracking-[0.2em] uppercase text-secondary font-bold mb-6">Established Intelligence</span>
<h1 className="font-headline text-6xl lg:text-8xl text-primary leading-tight mb-8 tracking-tighter">Precision Law,<br/><span className="italic">Digitally Rendered</span></h1>
<p className="text-xl text-on-surface-variant max-w-lg mb-10 leading-relaxed font-light">
                        JudicAI augments the judiciary with private, secure intelligence—transforming case backlogs into streamlined paths to justice. Built for the modern magistrate.
                    </p>
<div className="flex flex-wrap gap-4">
<button onClick={() => navigate('/dashboard')} className="bg-primary text-secondary-fixed px-8 py-4 rounded-sm font-bold text-lg hover:opacity-90 transition-all hero-gradient shadow-xl">Request Access</button>
<button onClick={() => navigate('/')} className="bg-transparent border border-outline-variant text-primary px-8 py-4 rounded-sm font-bold text-lg hover:bg-surface-container-low transition-all">View Methodology</button>
</div>
</div>
<div className="relative">
<div className="absolute -top-20 -right-20 w-96 h-96 bg-secondary-container opacity-20 blur-[100px] rounded-full"></div>
<div className="relative rounded-sm overflow-hidden shadow-2xl border border-outline-variant/10">
<img className="w-full h-auto object-cover" data-alt="A minimalist, sophisticated legal dashboard interface on a dark tablet screen, featuring data visualizations and document summaries with gold accents." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7ZN7JLoyBKtUgfZrK86NHPE-60Xz8R5hHtTE-CNMsAIAc_eVHQaR02gjDnS5m6Y8w2pQxuAoEadxAzQWV63kJGlfRtoF48Wi1LYh6Obs9YLybnCLrLrcEuIhnCSligqw7hsMs3_VoEDxSSf1sEllROeHfazAyVIPYbP07a7z9JlkB_1teUAAuzcEqwjwiyxIbwqob13u7DbztisewLH_5xzvmiiit3eSpfhcchGDopIMer7gqcqPo4Y-mpdZovJHtw8cJTLKeJ3M"/>
</div>
</div>
</div>
</section>
{/* Value Props (The Trinity) */}
<section id="solutions" className="py-24 bg-surface-container-low px-8">
<div className="max-w-7xl mx-auto">
<div className="grid md:grid-cols-3 gap-12">
<div className="p-8 bg-surface-container-lowest rounded-sm shadow-sm hover:bg-surface-container-high transition-all group">
<div className="w-12 h-12 flex items-center justify-center bg-primary text-secondary-fixed mb-6 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined" data-icon="speed">speed</span>
</div>
<h3 className="font-headline text-3xl text-primary mb-4">Accelerated Caseflow</h3>
<p className="text-on-surface-variant leading-relaxed">Eliminate administrative friction with AI that handles the heavy lifting of document digestion and cross-referencing.</p>
</div>
<div className="p-8 bg-surface-container-lowest rounded-sm shadow-sm hover:bg-surface-container-high transition-all group">
<div className="w-12 h-12 flex items-center justify-center bg-primary text-secondary-fixed mb-6 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined" data-icon="psychology">psychology</span>
</div>
<h3 className="font-headline text-3xl text-primary mb-4">Predictive Risk Intelligence</h3>
<p className="text-on-surface-variant leading-relaxed">Identify procedural risks and citation inconsistencies before they impact the ruling using deep judicial modeling.</p>
</div>
<div className="p-8 bg-surface-container-lowest rounded-sm shadow-sm hover:bg-surface-container-high transition-all group">
<div className="w-12 h-12 flex items-center justify-center bg-primary text-secondary-fixed mb-6 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined" data-icon="encrypted">encrypted</span>
</div>
<h3 className="font-headline text-3xl text-primary mb-4">Sovereign Security</h3>
<p className="text-on-surface-variant leading-relaxed">Your data never leaves your environment. We deploy local, sovereign AI nodes that respect the sanctity of chambers.</p>
</div>
</div>
</div>
</section>
{/* Feature Showcase */}
<section id="methodology" className="py-32 px-8 bg-surface">
<div className="max-w-7xl mx-auto">
<div className="mb-20 text-center max-w-2xl mx-auto">
<h2 className="font-headline text-5xl text-primary mb-6">Designed for the Bench</h2>
<p className="text-on-surface-variant text-lg">Every feature is crafted to meet the rigorous standards of the legal profession, focusing on clarity, auditability, and speed.</p>
</div>
<div className="grid gap-24">
{/* Feature 1 */}
<div className="flex flex-col lg:flex-row items-center gap-16">
<div className="lg:w-1/2">
<div className="inline-flex items-center gap-2 text-secondary font-bold mb-4">
<span className="material-symbols-outlined text-sm" data-icon="star">star</span>
<span className="uppercase tracking-widest text-xs">Innovation</span>
</div>
<h3 className="font-headline text-4xl text-primary mb-6">Priority Queueing</h3>
<p className="text-on-surface-variant text-lg mb-8 leading-relaxed">Automatically categorize and prioritize case files based on urgency, complexity, and judicial deadlines. Let the system organize the docket so you can focus on the decision.</p>
<ul className="space-y-4">
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-secondary" data-icon="check_circle">check_circle</span>
<span className="text-on-surface">Dynamic urgency assessment</span>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-secondary" data-icon="check_circle">check_circle</span>
<span className="text-on-surface">Automated procedural tracking</span>
</li>
</ul>
</div>
<div className="lg:w-1/2 rounded-sm overflow-hidden bg-surface-container shadow-xl">
<img className="w-full" data-alt="A clean UI showing a prioritized digital legal docket with status labels in muted tones of gold and blue, soft lighting on a premium screen." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGbmReFQbrWLsEkeSuZxT7G7ZXtEI5AlYcb6IgB3Jj8ph8EegAA8-Vr4RHnRlo_yzhZjQHQ2X9GHR-_C21cp9fMKeZ_L6_4AMl4jf6Zod1zu-PpSyhNRdmLHjuzRqoUiBrJyyMgVDiM9VdBKnVQAGibOZLtEI4bRNj8SiytD79jFrw3LDLgFXUK6HoqbN56q5UjdiuqBwA1NiWd6e9j2e_Z5l7wTBFiRJM15LzsB79T8DBI_URDyueT3bbAFcESKrjbMDbAbDbENA"/>
</div>
</div>
{/* Feature 2 */}
<div className="flex flex-col lg:flex-row-reverse items-center gap-16">
<div className="lg:w-1/2">
<div className="inline-flex items-center gap-2 text-secondary font-bold mb-4">
<span className="material-symbols-outlined text-sm" data-icon="description">description</span>
<span className="uppercase tracking-widest text-xs">Efficiency</span>
</div>
<h3 className="font-headline text-4xl text-primary mb-6">Automated Memos</h3>
<p className="text-on-surface-variant text-lg mb-8 leading-relaxed">Generate comprehensive judicial memos that summarize core arguments, list pertinent precedents, and highlight conflicting evidence in seconds.</p>
<div className="p-6 bg-surface-container-low border-l-4 border-secondary italic text-on-surface-variant">
                                "The speed at which JudicAI synthesizes 400-page briefs into coherent, actionable memos is revolutionary."
                            </div>
</div>
<div className="lg:w-1/2 rounded-sm overflow-hidden bg-surface-container shadow-xl">
<img className="w-full" data-alt="Close up of a digital document view with AI-highlighted legal citations and side-by-side precedent comparisons on a cream-colored digital background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWNXebHx-gyMCaRtFKk4NEYy-nW-hDQ43-w3EllOYs0eKTEHEu9tjuJ9v58IeeJt0xbTVwuH2Pz4xNJunzBTr7YvzkQaqwPbl8cEqbtGUdLPOqmPfaYO8X3tnfPhCnRXEHl4lc6nBxVyvgR0euJmBuMRynC99xANSnSMf3w0lh9z9fksd6GX-g1SHFZ39hKodFeJFJldnWzfYYwOKoyNH97d3TYlCjkSWHgzUGfjzPEx6g205-ULROT5O0ZbCojqBb70UseKQH2zM"/>
</div>
</div>
{/* Feature 3 */}
<div className="flex flex-col lg:flex-row items-center gap-16">
<div className="lg:w-1/2">
<div className="inline-flex items-center gap-2 text-secondary font-bold mb-4">
<span className="material-symbols-outlined text-sm" data-icon="analytics">analytics</span>
<span className="uppercase tracking-widest text-xs">Diagnostics</span>
</div>
<h3 className="font-headline text-4xl text-primary mb-6">Risk Diagnostics</h3>
<p className="text-on-surface-variant text-lg mb-8 leading-relaxed">Advanced pattern recognition identifies potential appeals risks by scanning current rulings against jurisdictional history and supreme court trends.</p>
<button className="text-primary font-bold border-b-2 border-secondary pb-1 hover:text-secondary transition-all">Explore Risk Modeling</button>
</div>
<div className="lg:w-1/2 rounded-sm overflow-hidden bg-surface-container shadow-xl">
<img className="w-full" data-alt="A sophisticated data visualization dashboard showing legal risk heatmaps and trend lines in navy and gold colors." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5mzK7rUeepBEnjPozrBEUyRq28PT3-2PtmB7BhpZfNDmFXBBbRhtJX9IO0NrTnF3fPuuTJ21sCnxkmzN1cf4CY6mKYIXDtqnCo2aMEzvNU3btYsYkia1VVTTZobKhXQ9GjUX2JOunWmagjRU5IrABT22290JJ0YA8IjyGBcRJ92Rtzc3kezpgFhDtfKBGo_5GBEugv3VEhaORtPUHlmhl6Nf53dmfDj26o6nQk51RGnRYQblqezMyqBXnmdthSX0uW-394hX15j8"/>
</div>
</div>
</div>
</div>
</section>
{/* Stats Section */}
<section id="security" className="py-24 bg-primary text-secondary-fixed">
<div className="max-w-7xl mx-auto px-8">
<div className="grid md:grid-cols-3 gap-12 text-center">
<div>
<div className="font-headline text-6xl mb-2">40%</div>
<div className="text-primary-fixed uppercase tracking-widest text-sm font-bold">Backlog Reduction</div>
</div>
<div>
<div className="font-headline text-6xl mb-2">99.9%</div>
<div className="text-primary-fixed uppercase tracking-widest text-sm font-bold">AI Consistency</div>
</div>
<div>
<div className="font-headline text-6xl mb-2">Secure</div>
<div className="text-primary-fixed uppercase tracking-widest text-sm font-bold">Local Infrastructure</div>
</div>
</div>
</div>
</section>
{/* CTA Section */}
<section className="py-32 bg-surface px-8 relative overflow-hidden">
<div className="absolute inset-0 opacity-5 pointer-events-none">
<div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #00003c 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
</div>
<div className="max-w-4xl mx-auto text-center relative z-10">
<h2 className="font-headline text-5xl lg:text-7xl text-primary mb-10 tracking-tight">Join the Future of the Judiciary</h2>
<p className="text-xl text-on-surface-variant mb-12 max-w-2xl mx-auto font-light">Experience the synergy of ancient tradition and modern intelligence. Request an executive briefing for your department today.</p>
<div className="flex flex-col sm:flex-row justify-center gap-4">
<button onClick={() => navigate('/dashboard')} className="bg-primary text-secondary-fixed px-10 py-5 rounded-sm font-bold text-xl hover:opacity-90 shadow-2xl transition-all">Request Executive Access</button>
<button onClick={() => navigate('/')} className="bg-white border border-outline-variant text-primary px-10 py-5 rounded-sm font-bold text-xl hover:bg-surface-container-low transition-all">Contact Chambers</button>
</div>
</div>
</section>
</main>
{/* Footer */}
<footer id="resources" className="bg-[#f6f3ee] py-12 px-8 border-t border-outline-variant/10">
<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
<div className="flex flex-col items-center md:items-start gap-4">
<div className="font-serif text-xl font-bold text-[#00003c] Newsreader">JudicAI</div>
<p className="text-[#1c1c19]/60 text-sm font-sans Public Sans text-center md:text-left">
                    © 2024 JudicAI Intelligence Systems. All rights reserved. Precise Law, Digitally Rendered.
                </p>
</div>
<div className="flex flex-wrap justify-center gap-8">
<Link className="text-[#1c1c19]/60 text-sm font-sans Public Sans hover:text-[#735c00] underline decoration-[#735c00] transition-all" to="/">Privacy Policy</Link>
<Link className="text-[#1c1c19]/60 text-sm font-sans Public Sans hover:text-[#735c00] underline decoration-[#735c00] transition-all" to="/">Terms of Service</Link>
<Link className="text-[#1c1c19]/60 text-sm font-sans Public Sans hover:text-[#735c00] underline decoration-[#735c00] transition-all" to="/">Security Whitepaper</Link>
<Link className="text-[#1c1c19]/60 text-sm font-sans Public Sans hover:text-[#735c00] underline decoration-[#735c00] transition-all" to="/">Contact Chambers</Link>
</div>
</div>
</footer>

    </div>
  );
}
