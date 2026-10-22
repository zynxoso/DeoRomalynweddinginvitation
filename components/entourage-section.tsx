import { entourage, type EntourageGroup } from "@/config/entourage";
import { Reveal } from "@/components/animations/reveal";
import { Botanical } from "@/components/botanical";

function RoleGroup({ group }: { group: EntourageGroup }) {
  const headingId = `entourage-${group.id}`;
  return <Reveal className="entourage-group">
    <section aria-labelledby={headingId}>
      <h3 id={headingId}>{group.title}</h3>
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
        {row.groups.map(group => <RoleGroup key={group.id} group={group} />)}
      </div>)}
    </div>
  </section>;
}
