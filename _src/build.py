"""Builds the Mahatrix website pages from shared parts.   python3 _src/build.py   (run from the site folder)
Pages: Home, Job seekers, Pricing, Staffing firms, Employers, About, Contact. base.html = the original one-page site
(its demo / how-it-works / employer sections are reused word for word)."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
B = open(os.path.join(HERE, 'base.html'), encoding='utf-8').read()
def sec(sid):
    m = re.search(r'<section id="%s"[^>]*>.*?</section>' % sid, B, re.S); assert m, sid; return m.group(0)
INTRO = re.search(r'<!-- logo unveil -->.*?</div>\n</div>\n', B, re.S).group(0)
HERO_BOARD = re.search(r'<div class="board glass rv d2" id="board".*?</p>\n    </div>', B, re.S).group(0)
MARQUEE = re.search(r'<div class="marquee".*?</div></div>', B, re.S).group(0)
CHAT = re.search(r'<!-- chat -->.*?</div>\n</div>\n', B, re.S).group(0)
DEMO = sec('demo').replace('From new job to assessment invite, in 15 seconds.', 'From new job to interview, in 30 seconds.').replace('This is the real portal our recruiters use every day.', 'Matched jobs, a tailored resume, then the assessment, screening and interview — every step in your account.').replace('<div><b>Applied</b>Saved in your account</div>\n      <div><b>Assessment</b>Invite tracked and followed up</div>', '<div><b>Assessment</b>Invites caught and tracked</div>\n      <div><b>Screening</b>Calls booked, prep sheet ready</div>\n      <div><b>Interview</b>Every step in one place</div>').replace('Recorded in our demo portal — the people, companies and jobs are invented.', 'Illustration — the people, companies and jobs are invented.').replace('mahatrix-demo.mp4', 'mahatrix-demo-30s.mp4'); EMP = sec('employers')
SITE = 'https://mahatrixtechnologies.com'; PORTAL = 'https://portal.mahatrixtechnologies.com'

NAV = [('/job-seekers.html', 'Job seekers'), ('/pricing.html', 'Pricing'), ('/staffing-firms.html', 'Staffing firms'),
       ('/employers.html', 'Employers'), ('/about.html', 'About'), ('/contact.html', 'Contact')]


def head(title, desc, path):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#060708">
<link rel="icon" href="/assets/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{SITE}/assets/demo-poster.jpg">
<meta property="og:url" content="{SITE}{path}">
<link rel="canonical" href="{SITE}{path}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css">
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"Organization","name":"Mahatrix Technologies","url":"{SITE}","logo":"{SITE}/assets/logo.png","email":"info@mahatrixtechnologies.com"}}</script>
</head>
<body>
<div class="ambient" aria-hidden="true"><i></i><i></i></div>
'''


def header(path):
    links = ''.join(f'\n      <a href="{h}"{" aria-current=\"page\"" if h == path else ""}>{t}</a>' for h, t in NAV)
    return f'''<a class="skip" href="#main">Skip to content</a>

<header class="site-head">
  <div class="wrap bar">
    <a class="brand" href="/" aria-label="Mahatrix Technologies home"><img src="/assets/logo.png" alt="" width="36" height="36"><b>MAHATRIX</b></a>
    <nav class="nav" aria-label="Main">{links}
    </nav>
    <div class="head-cta">
      <a class="btn btn-ghost" href="{PORTAL}">Sign in</a>
      <a class="btn btn-primary" href="/pricing.html" data-signup="trial">Start free trial</a>
    </div>
    <button class="menu-btn" aria-label="Open menu" aria-expanded="false"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 8h16M4 16h16"/></svg></button>
  </div>
</header>

<main id="main">
'''


FOOT = f'''</main>

<footer class="site-foot">
  <div class="wrap">
    <a class="brand" href="/"><img src="/assets/logo.png" alt="" width="28" height="28"><span>© <span id="year">2026</span> Mahatrix Technologies</span></a>
    <nav aria-label="Footer">
      <a href="/job-seekers.html">Job seekers</a>
      <a href="/pricing.html">Pricing</a>
      <a href="/staffing-firms.html">Staffing firms</a>
      <a href="/employers.html">Employers</a>
      <a href="/about.html">About</a>
      <a href="/contact.html">Contact</a>
      <a href="/privacy.html">Privacy</a>
      <a href="/terms.html">Terms</a>
      <a href="{PORTAL}">Sign in</a>
    </nav>
  </div>
</footer>

<!-- free trial: the account is ready at once -->
<dialog id="signup" aria-labelledby="signupTitle">
  <div class="dlg-head"><div><h2 id="signupTitle">Start your free trial</h2><p class="muted" style="margin:6px 0 0">5 days of Launch, free. No card needed. Your account is ready as soon as you press Create account.</p></div><button class="x" type="button" data-close aria-label="Close">✕</button></div>
  <form class="form" novalidate>
    <input type="hidden" name="plan" value="trial">
    <label>First name<input name="first_name" autocomplete="given-name" required></label>
    <label>Last name<input name="last_name" autocomplete="family-name" required></label>
    <label>Email<input name="email" type="email" autocomplete="email" required></label>
    <label>Phone<input name="phone" type="tel" autocomplete="tel" required></label>
    <label class="full">Job role you want<input name="role" placeholder="e.g. Data Engineer, Java Developer, Business Analyst" required></label>
    <label>Work authorization<select name="visa"><option value="">Choose…</option><option>H-1B</option><option>OPT / STEM OPT</option><option>CPT</option><option>H-4 EAD</option><option>Green card</option><option>U.S. citizen</option><option>Other</option></select></label>
    <label>Years of experience<input name="experience" inputmode="numeric" placeholder="e.g. 6"></label>
    <label>Choose a 6-digit PIN<input name="pin" type="password" inputmode="numeric" maxlength="6" autocomplete="new-password" required></label>
    <label>Type the PIN again<input name="pin2" type="password" inputmode="numeric" maxlength="6" autocomplete="new-password" required></label>
    <label class="full">LinkedIn (optional)<input name="linkedin" placeholder="linkedin.com/in/…"></label>
    <span class="trap" aria-hidden="true"><input name="website" tabindex="-1" autocomplete="off"></span>
    <label class="check full"><input type="checkbox" name="agree" value="1"><span>I agree to the <a href="/terms.html" target="_blank">Terms</a> and <a href="/privacy.html" target="_blank">Privacy Policy</a>, and I understand Mahatrix does not guarantee a job or interviews.</span></label>
    <div class="err full" role="alert"></div>
    <div class="row-end full"><button class="btn btn-ghost" type="button" data-close>Cancel</button><button class="btn btn-primary" type="submit">Create account</button></div>
  </form>
  <div class="done" hidden><p><b>Your account is ready.</b></p><p>Sign in with your email and the PIN you just chose, then upload your resume — your matched jobs appear right away.</p>
    <div class="row-end"><button class="btn btn-ghost" type="button" data-close>Close</button><a class="btn btn-primary" id="signupGo" href="{PORTAL}">Sign in now</a></div></div>
</dialog>

{CHAT}
<script src="/assets/site.js" defer></script>
</body>
</html>
'''


def page(path, title, desc, body, intro=False):
    return head(title, desc, path) + ('\n' + INTRO if intro else '') + '\n' + header(path) + body + FOOT


def cta(h, p, btn='Start free trial', kind='trial'):
    act = f'<a class="btn btn-primary" href="/pricing.html" data-signup="{kind}">{btn}</a>' if kind else f'<a class="btn btn-primary" href="/contact.html" data-chat="">{btn}</a>'
    return f'''
<section aria-label="{h}">
  <div class="wrap">
    <div class="contact glass rv">
      <div><h2>{h}</h2><p class="lede">{p}</p></div>
      <div class="actions">{act}<span class="hint">Already a customer? <a href="{PORTAL}">Sign in</a></span></div>
    </div>
  </div>
</section>
'''


# ---------------------------------------------------------------- plans (prices shown)
PLANS = [   # only Launch shows a price; the others are by conversation (email or chat). No job counts on the site.
    ('starter', 'Launch', '$30', 'You apply — we find and prepare', ['Fresh jobs matched to your resume, every day', '2 tailored resumes a day',
     'Full-time jobs', 'Application tracker in your account'], 'Start with Launch', False),
    ('pro', 'Accelerate', '', 'You apply — with more firepower', ['Maximum fresh matches, updated hourly', '5 tailored resumes a day', 'Full-time jobs',
     'Skill-gap report', 'Application tracker in your account'], 'Talk to us', True),
    ('exclusive', 'Autopilot', '', 'A dedicated recruiter runs your search', ['Your own recruiter, every working day', 'Full-time, W2 and C2C jobs',
     'Vendor requirements matched to you', 'Unlimited tailored resumes', 'Interview prep and follow-ups'], 'Talk to us', False),
]
MAIL = 'info@mahatrixtechnologies.com'


def plan_cards(short=False):
    out = []
    for i, (pid, name, price, who, perks, btn, pick) in enumerate(PLANS):
        if price:
            pr = f'<p class="price"><b>{price}</b><span>/ month</span></p>'
            b = f'<button class="btn {"btn-primary" if pick else "btn-ghost"}" data-signup="{pid}">{btn}</button>'
        else:
            pr = '<p class="price ask"><b>Let\'s talk</b><span>tailored to you</span></p>'
            b = (f'<div class="plan-acts"><button class="btn {"btn-primary" if pick else "btn-ghost"}" data-chat="job_seeker" data-msg="I am interested in the {name} plan.">Chat with us</button>'
                 f'<a class="btn btn-ghost" href="mailto:{MAIL}?subject={name}%20plan">Email us</a></div>')
        out.append(f'''      <article class="plan glass lit tilt{" pick" if pick else ""} rv{" d" + str(i) if i else ""}">
        {'<span class="tag">Most popular</span>' if pick else ''}<h3>{name}</h3>{pr}<p class="apps">{who}</p>
        <ul>{''.join(f"<li>{x}</li>" for x in (perks[:3] if short else perks))}</ul>
        {b}
      </article>''')
    return '<div class="plans plans3">\n' + '\n'.join(out) + '\n    </div>'


ZERO = '<div class="zero-cut glass lit rv"><b>0%</b><div><h3>We never take a cut of your salary.</h3><p>No placement fee, no percentage, nothing after you\'re hired — the job and the full paycheck are yours.</p></div></div>'
TRIAL = '<div class="trial-line glass rv"><p><b>Not sure yet?</b> Try Launch free for 5 days. No card needed — your account is ready in a minute.</p><a class="btn btn-ghost" href="#" data-signup="trial">Start free trial</a></div>'

FAQ_SEEKER = [
    ('Do you guarantee a job or interviews?', 'No. Employers decide who they call, and anyone who guarantees that is not being straight with you. What we guarantee is the work: fresh matching jobs, careful applications, and a clear report of results.'),
    ('Who applies — me or you?', 'On Launch and Accelerate you apply yourself, with your matched jobs and tailored resumes ready in your account. On Autopilot, a dedicated Mahatrix recruiter applies for you every working day and records each application.'),
    ('Where do the jobs come from?', 'From employers across the USA, checked around the clock. New jobs are added every hour and matched to your resume.'),
    ('What about my work authorization?', 'Tell us your status when you sign up. Jobs that say you can\'t apply — for example citizenship or a clearance required, or no visa sponsorship when you need it — are filtered out.'),
    ('Do you take a percentage of my salary when I get hired?', 'No — never. There is no placement fee and no percentage of your pay, before or after you\'re hired. You only pay for your plan.'),
]
FAQ_PLANS = [
    ('What is the difference between Launch and Accelerate?', 'Both bring you full-time jobs matched to your resume, and you apply yourself. Accelerate gives you more fresh matches as they arrive, more tailored resumes each day and a skill-gap report. Message us and we will set it up for you.'),
    ('What does Autopilot add?', 'A dedicated recruiter who applies for you, W2 and C2C contract jobs and vendor requirements as well as full-time jobs, unlimited tailored resumes, and interview preparation.'),
    ('How does the free trial work?', 'You get 5 days of Launch, free, with no card. Create your account, upload your resume and your matched jobs appear right away. Choose a plan in your account when you are ready.'),
    ('Why don\'t Accelerate and Autopilot show a price?', 'They are set up around your role, experience and goals. Send us a message or email and we reply with the details for you.'),
    ('Can I cancel?', 'Yes. Plans are month to month. If you don\'t renew, the plan pauses at the end of the month and you can still sign in to see your past applications.'),
    ('What happens to my resume and details?', 'They are used only to run your job search and are never sold. See our <a href="/privacy.html">privacy policy</a>, or email us to have your data deleted.'),
]


def faq(items, h='Questions', sid='faq'):
    return f'''
<section id="{sid}" aria-labelledby="{sid}-h">
  <div class="wrap">
    <div class="sec-head"><h2 id="{sid}-h" class="rv">{h}</h2></div>
    <div class="faq rv d1">
''' + '\n'.join(f'      <details><summary>{q}</summary><p>{a}</p></details>' for q, a in items) + '''
    </div>
  </div>
</section>
'''


HOW = '''
<section id="how" aria-labelledby="how-h">
  <div class="wrap">
    <div class="sec-head">
      <h2 id="how-h" class="rv">How it works</h2>
      <p class="lede rv d1">Four steps, every working day.</p>
    </div>
    <ol class="steps">
      <li class="step glass lit rv"><span class="n"></span><h3>Your profile</h3><p>Create your account, upload your resume and pick the roles you want and where you live.</p></li>
      <li class="step glass lit rv d1"><span class="n"></span><h3>Jobs matched</h3><p>New jobs arrive every hour and are scored against your resume. The freshest, strongest matches come first.</p></li>
      <li class="step glass lit rv d2"><span class="n"></span><h3>Apply with a tailored resume</h3><p>Apply yourself with a resume tailored to each job from your real experience — or let your Autopilot recruiter apply for you.</p></li>
      <li class="step glass lit rv d3"><span class="n"></span><h3>Calls and next steps</h3><p>Track every application and reply. Screens and interviews come with a prep sheet.</p></li>
    </ol>
  </div>
</section>
'''

PROMISE = '''
<section aria-labelledby="promise-h">
  <div class="wrap promise">
    <div>
      <h2 id="promise-h" class="rv" style="margin-bottom:24px">What we promise</h2>
      <blockquote class="rv d1">No one can honestly promise you a job. We promise the work: fresh jobs, careful applications, and an honest report of what happened.</blockquote>
    </div>
    <ul class="dont glass rv d2">
      <li><b>No job or interview guarantees.</b> Hiring decisions are the employer's.</li>
      <li><b>Quality over volume.</b> Weak matches are skipped unless there is a real reason to apply.</li>
      <li><b>Your data is not for sale.</b> We use it only to run your job search.</li>
      <li><b>Nothing sent in your name without review.</b> Follow-ups are checked by a person first.</li>
    </ul>
  </div>
</section>
'''

AUD = '''
<section aria-labelledby="aud-h">
  <div class="wrap">
    <div class="sec-head"><h2 id="aud-h" class="rv">Built for three kinds of people</h2></div>
    <div class="svc">
      <article class="glass lit rv"><h3>Job seekers</h3><p>IT professionals in the U.S. — H-1B, OPT, green card or citizen — who want fresh, well-matched applications without spending every evening on them.</p><p><a href="/job-seekers.html">How it works for you →</a></p></article>
      <article class="glass lit rv d1"><h3>Staffing firms</h3><p>Fresh matches for every bench candidate, a daily team dashboard and vendor requirements matched to your bench — under your own logins.</p><p><a href="/staffing-firms.html">See the platform →</a></p></article>
      <article class="glass lit rv d2"><h3>Employers</h3><p>Direct hire, contract and contract-to-hire technology talent — screened and shortlisted for your team.</p><p><a href="/employers.html">Hire with us →</a></p></article>
    </div>
  </div>
</section>
'''


ENGINE = '''
<section id="engine" aria-labelledby="engine-h">
  <div class="wrap">
    <div class="sec-head">
      <h2 id="engine-h" class="rv">The engine behind your search</h2>
      <p class="lede rv d1">Every hour it finds new jobs, scores them against your resume, removes the ones you can't apply to, and tailors your resume for the best matches.</p>
    </div>
    <div class="engine">
      <div class="term glass rv" aria-label="Illustration of the matching engine at work">
        <div class="term-bar"><i></i><i></i><i></i><span>mahatrix — match engine</span></div>
        <pre class="term-body" aria-hidden="true"></pre>
        <noscript><pre class="term-body">$ scan --role "Data Engineer"\n✓ new jobs found across the USA</pre></noscript>
      </div>
      <div class="flow glass rv d1" aria-label="From a new job to an interview">
        <ol class="flow-steps">
          <li><b>New job found</b><span>Checked every hour</span></li>
          <li><b>Scored against your resume</b><span>Best matches first</span></li>
          <li><b>Resume tailored</b><span>From your real experience</span></li>
          <li><b>Applied</b><span>Saved in your account</span></li>
          <li><b>Assessment &amp; screening</b><span>Replies caught and tracked</span></li>
          <li><b>Interview</b><span>Prep sheet ready</span></li>
        </ol>
      </div>
    </div>
  </div>
</section>
'''

# ---------------------------------------------------------------- pages
HOME = f'''
<section class="hero" aria-labelledby="hero-h">
  <div class="wrap">
    <div>
      <div class="pill-note glass rv"><b>New</b>Plans from $30 a month · 5-day free trial</div>
      <h1 id="hero-h" class="grad rv d1">Fresh IT jobs, matched to your resume.</h1>
      <p class="lede rv d2">Mahatrix finds new IT jobs across the USA every hour and matches each one to your resume. Apply in minutes with a resume tailored to the job — or let a dedicated recruiter apply for you.</p>
      <div class="hero-ctas rv d3">
        <a class="btn btn-primary" href="/pricing.html" data-signup="trial">Start 5-day free trial</a>
        <a class="btn btn-ghost" href="#demo"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>Watch 30-second demo</a>
      </div>
      <div class="facts rv d4">
        <div><b>Across the USA</b><span>companies hiring now</span></div>
        <div><b>Every hour</b><span>new jobs found</span></div>
        <div><b>0%</b><span>of your salary, ever</span></div>
      </div>
    </div>

    {HERO_BOARD}
  </div>
</section>

{MARQUEE}
{ENGINE}
{DEMO}
{HOW}
{AUD}
<section id="pricing" aria-labelledby="pricing-h">
  <div class="wrap">
    <div class="sec-head">
      <h2 id="pricing-h" class="rv">Simple monthly plans</h2>
      <p class="lede rv d1">Month to month — stop any time. <a href="/pricing.html">Compare the plans →</a></p>
    </div>
    {plan_cards(short=True)}
  </div>
</section>
{PROMISE}{cta('Ready when you are', 'Create your free account in a minute. Upload your resume and your matched jobs appear right away.')}'''

SEEKERS = f'''
<section class="hero sub" aria-labelledby="js-h">
  <div class="wrap"><div>
    <h1 id="js-h" class="grad rv">For job seekers</h1>
    <p class="lede rv d1">For IT professionals in the U.S. — H-1B, OPT, green card or citizen — who want more of the right applications without spending every evening on them.</p>
    <div class="hero-ctas rv d2"><a class="btn btn-primary" href="/pricing.html" data-signup="trial">Start 5-day free trial</a><a class="btn btn-ghost" href="/pricing.html">See plans</a></div>
  </div></div>
</section>

<section aria-labelledby="get-h">
  <div class="wrap">
    <div class="sec-head"><h2 id="get-h" class="rv">What you get</h2></div>
    <div class="svc">
      <article class="glass lit rv"><h3>Fresh jobs, matched to you</h3><p>New jobs every hour, scored against your resume. The freshest and strongest matches come first, near you first.</p></article>
      <article class="glass lit rv d1"><h3>Resumes tailored to each job</h3><p>Built from the experience you already have — the job's key skills, in your own work history.</p></article>
      <article class="glass lit rv d2"><h3>Every application in one place</h3><p>Mark what you applied to and see every reply. Your account keeps the full history.</p></article>
      <article class="glass lit rv"><h3>Skill-gap report</h3><p>The skills employers keep asking for that your resume doesn't show yet.</p></article>
      <article class="glass lit rv d1"><h3>Interview prep</h3><p>A prep sheet as soon as a screening or interview is booked.</p></article>
      <article class="glass lit rv d2"><h3>Or a recruiter does it all</h3><p>On Autopilot, a dedicated recruiter applies for you every working day — W2, C2C and full-time.</p></article>
    </div>
  </div>
</section>
{ENGINE}{DEMO}{HOW}{faq(FAQ_SEEKER)}{cta('Try it free for 5 days', 'No card needed. Your account is ready in a minute.')}'''

PRICING = f'''
<section id="pricing" class="hero sub" aria-labelledby="pricing-h">
  <div class="wrap">
    <div class="sec-head">
      <h1 id="pricing-h" class="grad rv">Plans</h1>
      <p class="lede rv d1">Month to month — stop any time. Start with a 5-day free trial of Launch.</p>
    </div>
    {ZERO}
    {TRIAL}
    {plan_cards()}
    <div class="cmp glass rv">
      <table>
        <thead><tr><th></th><th>Launch</th><th>Accelerate</th><th>Autopilot</th></tr></thead>
        <tbody>
          <tr><th>Price</th><td>$30 / month</td><td><a href="#" data-chat="job_seeker" data-msg="I am interested in the Accelerate plan.">Talk to us</a></td><td><a href="#" data-chat="job_seeker" data-msg="I am interested in the Autopilot plan.">Talk to us</a></td></tr>
          <tr><th>Who applies</th><td>You</td><td>You</td><td>Your dedicated recruiter</td></tr>
          <tr><th>Fresh job matches</th><td>Every day</td><td>Maximum, hourly</td><td>Maximum, hourly</td></tr>
          <tr><th>Job types</th><td>Full-time</td><td>Full-time</td><td>Full-time, W2, C2C</td></tr>
          <tr><th>Vendor requirements</th><td>—</td><td>—</td><td>Yes</td></tr>
          <tr><th>Tailored resumes</th><td>2 a day</td><td>5 a day</td><td>Unlimited</td></tr>
          <tr><th>Skill-gap report</th><td>—</td><td>Yes</td><td>Yes</td></tr>
          <tr><th>Interview prep</th><td>—</td><td>—</td><td>Yes</td></tr>
        </tbody>
      </table>
    </div>
    <div class="firm-plan glass rv">
      <p><b>Staffing firms:</b> the full platform for your recruiters, per recruiter seat. Tell us your team size and we'll send a quote.</p>
      <a class="btn btn-ghost" href="/contact.html" data-chat="staffing_firm">Get a quote</a>
    </div>
  </div>
</section>
{faq(FAQ_PLANS, 'Plan questions')}'''

FIRMS = f'''
<section class="hero sub" aria-labelledby="sf-h">
  <div class="wrap"><div>
    <h1 id="sf-h" class="grad rv">For staffing firms &amp; consultancies</h1>
    <p class="lede rv d1">Give your recruiters a sharper daily workflow — under your own logins, with your candidates' data kept separate.</p>
    <div class="hero-ctas rv d2"><a class="btn btn-primary" href="/contact.html" data-chat="staffing_firm">Book a walkthrough</a></div>
  </div></div>
</section>

<section aria-labelledby="sff-h">
  <div class="wrap">
    <div class="sec-head"><h2 id="sff-h" class="rv">What your team gets</h2></div>
    <div class="svc">
      <article class="glass lit rv"><h3>Fresh matches for every bench candidate</h3><p>New jobs every hour, the best openings first, filtered by work authorization and location.</p></article>
      <article class="glass lit rv d1"><h3>A minimum-match rule</h3><p>Effort goes where interviews come from — weak matches are kept off the list.</p></article>
      <article class="glass lit rv d2"><h3>A daily team dashboard</h3><p>Who applied to what, targets per candidate, points and what is pending.</p></article>
      <article class="glass lit rv"><h3>Results that show what works</h3><p>Replies by industry, vendor, source and job age, so your team works where calls come from.</p></article>
      <article class="glass lit rv d1"><h3>Vendor requirements, matched</h3><p>Requirement emails from your inbox become jobs, matched to your bench automatically.</p></article>
      <article class="glass lit rv d2"><h3>Tailored resumes and prep</h3><p>Resumes tailored from each candidate's real experience, and a prep sheet for every call.</p></article>
    </div>
  </div>
</section>
{DEMO}{cta('See it with your own bench', 'We walk your team through the platform with your roles and your candidates. Message us with your team size.', 'Book a walkthrough', '')}'''

EMPLOYERS = f'''
<section class="hero sub" aria-labelledby="em-h">
  <div class="wrap"><div>
    <h1 id="em-h" class="grad rv">Hiring tech talent? We staff it.</h1>
    <p class="lede rv d1">Permanent, contract or contract-to-hire technology professionals — found, screened and shortlisted for your team.</p>
  </div></div>
</section>
{EMP.replace('href="#contact"', 'href="/contact.html"')}'''

ABOUT = f'''
<section class="hero sub" aria-labelledby="ab-h">
  <div class="wrap"><div>
    <h1 id="ab-h" class="grad rv">About Mahatrix</h1>
    <p class="lede rv d1">Mahatrix Technologies is a U.S. staffing and job-search company. We combine software that finds and matches fresh jobs every hour with recruiters who know the IT market — so job seekers spend their time on the applications that can turn into calls.</p>
  </div></div>
</section>

<section aria-labelledby="ab2-h">
  <div class="wrap">
    <div class="svc">
      <article class="glass lit rv"><h3>Fresh over stale</h3><p>Most screening calls come from applying in the first days a job is open. We find new jobs every hour and put them first.</p></article>
      <article class="glass lit rv d1"><h3>Real experience, well told</h3><p>Resumes are tailored from what a person has actually done — never invented employers, titles or dates.</p></article>
      <article class="glass lit rv d2"><h3>Honest reporting</h3><p>Every application and reply is in your account. We tell you what is working and what isn't.</p></article>
    </div>
  </div>
</section>
{PROMISE}{cta('Talk to us', 'Questions about plans, a role you need to fill, or a walkthrough for your team — we reply by email.', 'Send us a message', '')}'''

CONTACT = f'''
<section class="hero sub" aria-labelledby="contact-h">
  <div class="wrap">
    <div class="contact glass rv">
      <div>
        <h1 id="contact-h">Talk to us</h1>
        <p class="lede">Questions about plans, a role you need to fill, a walkthrough for your team, or help with your account — send us a message and we'll reply by email.</p>
      </div>
      <div class="actions">
        <a class="mail" href="mailto:info@mahatrixtechnologies.com">info@mahatrixtechnologies.com</a>
        <button class="btn btn-primary" type="button" data-chat="">Send us a message</button>
        <span class="hint">Already a customer? <a href="{PORTAL}">Sign in</a></span>
      </div>
    </div>
  </div>
</section>
{faq(FAQ_SEEKER[:2] + FAQ_PLANS[2:4])}'''

PAGES = [
    ('index.html', '/', 'Mahatrix Technologies — Fresh IT jobs, matched to your resume', 'New IT jobs across the USA every hour, matched to your resume, with tailored resumes. Plans from $30 a month, or a dedicated recruiter applies for you. 5-day free trial.', HOME, True),
    ('job-seekers.html', '/job-seekers.html', 'For job seekers — Mahatrix Technologies', 'Fresh IT jobs matched to your resume, tailored resumes, an application tracker and interview prep — for H-1B, OPT, green card and U.S. citizen IT professionals.', SEEKERS, False),
    ('pricing.html', '/pricing.html', 'Plans and pricing — Mahatrix Technologies', 'Launch from $30 a month, Accelerate and Autopilot by conversation. Fresh IT jobs matched to your resume and tailored resumes — or a dedicated recruiter. 0% of your salary, ever.', PRICING, False),
    ('staffing-firms.html', '/staffing-firms.html', 'For staffing firms — Mahatrix Technologies', 'Fresh job matches for every bench candidate, a daily team dashboard, vendor requirements matched to your bench and results that show what works.', FIRMS, False),
    ('employers.html', '/employers.html', 'Hire tech talent — Mahatrix Technologies', 'Direct hire, contract and contract-to-hire technology talent across the United States — screened and shortlisted for your team.', EMPLOYERS, False),
    ('about.html', '/about.html', 'About — Mahatrix Technologies', 'Mahatrix Technologies combines hourly job matching with experienced IT recruiters. No job guarantees, no cut of your salary, your data never sold.', ABOUT, False),
    ('contact.html', '/contact.html', 'Contact — Mahatrix Technologies', 'Questions about plans, hiring or a walkthrough for your team — message Mahatrix Technologies and we reply by email.', CONTACT, False),
]
for fn, path, title, desc, body, intro in PAGES:
    open(os.path.join(ROOT, fn), 'w', encoding='utf-8').write(page(path, title, desc, body, intro))
sm = ''.join(f'  <url><loc>{SITE}{p}</loc></url>\n' for _, p, *_ in PAGES) + f'  <url><loc>{SITE}/privacy.html</loc></url>\n  <url><loc>{SITE}/terms.html</loc></url>\n'
open(os.path.join(ROOT, 'sitemap.xml'), 'w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + sm + '</urlset>\n')
print('built', len(PAGES), 'pages')
