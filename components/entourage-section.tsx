import { entourage, type EntourageGroup } from "@/config/entourage";
import { Reveal } from "@/components/animations/reveal";
import { Botanical } from "@/components/botanical";

function RoleGroup({ group, nested = false }: { group: EntourageGroup; nested?: boolean }) {
  const headingId = `entourage-${group.id}`;
  const Heading = nested ? "h4" : "h3";
  return <Reveal className="entourage-group">
    <section aria-labelledby={headingId}>
      <Heading id={headingId}>{group.title}</Heading>
      <ul className={group.paired ? "entourage-names entourage-pair" : "entourage-names"}>
        {group.members.map((member, index) => <li key={member.name}>
          {group.paired && index > 0 && <span className="entourage-ampersand" aria-hidden="true">&</span>}
          <span className="entourage-name">{member.name}</span>
          {member.label && <span className="entourage-label">{member.label}</span>}
        </li>)}
      </ul>
    </section>
  </Reveal>;
}

export function EntourageSection() {
  return <section id="entourage" className="entourage section-space" aria-labelledby="entourage-title">
    <div className="section-container entourage-container">
      <Reveal className="section-heading entourage-heading">
        <Botanical className="entourage-botanical" />
        <h2 id="entourage-title">Our <em>Entourage</em></h2>
        <p>The people standing with us as we begin our married life.</p>
      </Reveal>
      {entourage.map(row => <div key={row.id} className={`entourage-row entourage-${row.layout}`}>
        {row.title && <Reveal className="entourage-row-title"><h3>{row.title}</h3></Reveal>}
        {row.groups.map(group => <RoleGroup key={group.id} group={group} nested={Boolean(row.title)} />)}
      </div>)}
    </div>
  </section>;
}
