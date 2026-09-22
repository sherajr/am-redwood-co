"use client";
import { Hammer, Sprout, Sparkles, Truck, HeartHandshake, Guitar } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { services } from "@/content/site";
const icons = [Hammer, Sprout, Sparkles, Truck, HeartHandshake, Guitar];
export function Services() {
    return <Accordion type="single" collapsible defaultValue="build" className="services-list reveal">{services.map((service, index) => { const Icon = icons[index]; return <AccordionItem value={service.id} key={service.id} className="service-item"><AccordionTrigger className="service-trigger"><span className="service-index">{service.number}</span><Icon className="service-icon" strokeWidth={1.4}/><span>{service.title}</span></AccordionTrigger><AccordionContent className="service-content"><p>{service.summary}</p><ul>{service.items.map(item => <li key={item}>{item}</li>)}</ul></AccordionContent></AccordionItem>; })}</Accordion>;
}
