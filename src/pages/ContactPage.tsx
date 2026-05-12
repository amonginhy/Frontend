import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { Button, Container, Input } from '@shared/ui';
import { toast } from '@app/store/toast.store';

const schema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email'),
  topic: z.string().min(2, 'Pick a topic'),
  message: z.string().min(10, 'A few more words please'),
});
type Form = z.infer<typeof schema>;

const channels = [
  {
    icon: <Mail size={18} />,
    title: 'Email us',
    body: 'support@edenscrunchbox.com',
    description: 'We reply within 2 hours, every day.',
  },
  {
    icon: <Phone size={18} />,
    title: 'Talk to a human',
    body: '+256 (700) 123-456',
    description: 'Mon–Sun · 8am–10pm local time.',
  },
  {
    icon: <MapPin size={18} />,
    title: 'Visit HQ',
    body: 'Plot 14 Acacia Ave, Kololo, Kampala',
    description: 'By appointment.',
  },
];

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', topic: '', message: '' },
  });

  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success('Message sent', "We'll get back to you within 2 hours.");
    reset();
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="py-14 lg:py-20 grid lg:grid-cols-[1fr_1.2fr] gap-10">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent-600">
            Contact
          </span>
          <h1 className="text-display text-4xl sm:text-5xl font-semibold text-burgundy-700 mt-3 leading-tight">
            Let's bake something together.
          </h1>
          <p className="text-ink-500 mt-4 leading-relaxed max-w-md">
            Ordering for a wedding? Onboarding a bakery? Press inquiry? We'd
            love to hear from you.
          </p>
          <div className="mt-8 space-y-4">
            {channels.map((c) => (
              <div
                key={c.title}
                className="flex items-start gap-3 p-4 bg-white rounded-3xl border border-cream-100 shadow-soft"
              >
                <span className="h-11 w-11 rounded-2xl bg-cream-100 text-burgundy-700 grid place-items-center shrink-0">
                  {c.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-ink-400 font-semibold">
                    {c.title}
                  </p>
                  <p className="font-semibold text-ink-800 truncate">{c.body}</p>
                  <p className="text-xs text-ink-500 mt-0.5">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6 lg:p-8 flex flex-col gap-4"
        >
          <div className="flex items-center gap-2 text-burgundy-700">
            <MessageCircle size={18} />
            <h2 className="text-display text-xl font-semibold">Send us a message</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Name" {...register('name')} error={errors.name?.message} />
            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
          </div>
          <Input
            label="Topic"
            placeholder="Wedding · Onboarding · Press"
            {...register('topic')}
            error={errors.topic?.message}
          />
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ink-700">Message</span>
            <textarea
              rows={5}
              {...register('message')}
              placeholder="Tell us a bit more…"
              className="rounded-2xl border border-cream-200 bg-white p-4 text-sm focus-ring resize-none"
            />
            {errors.message && (
              <span className="text-xs text-rose-500">{errors.message.message}</span>
            )}
          </label>
          <Button
            type="submit"
            size="lg"
            className="self-start"
            rightIcon={<Send size={16} />}
            loading={isSubmitting}
          >
            Send message
          </Button>
        </form>
      </Container>
    </motion.div>
  );
}
