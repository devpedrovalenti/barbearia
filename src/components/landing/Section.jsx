export default function Section({ id, title, intro, center, children }) {
  return (
    <section id={id} className="section"><div className="container">
      <div className={center ? 'sec-head center' : 'sec-head'}><h2>{title}</h2>{intro && <p className="muted intro">{intro}</p>}</div>{children}
    </div></section>
  )
}
