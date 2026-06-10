"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  IconMessageDots,
  IconPhoneCall,
  IconMapPin,
  IconArrowRight,
  IconCircleCheck,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { publicPost } from "@/lib/api";

const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof ContactSchema>;

export const Hero = () => {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema as any),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      await publicPost("/contact", values);
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] opacity-60" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-primary text-xs font-bold mb-6">
              <IconMessageDots size={16} />
              <span>WE'RE ALWAYS LISTENING</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Got an Idea? <br className="hidden lg:block" />
              <span className="text-primary">Let's Talk.</span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Whether you're looking to partner, have questions about the School
              of Innovation, or want to volunteer for the next conference, we're
              one message away.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-md hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                  <IconPhoneCall size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                    Call Us
                  </p>
                  <p className="text-gray-900 font-bold">+234 810 156 9177</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-md hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                  <IconMapPin size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                    Visit Us
                  </p>
                  <p className="text-gray-900 font-bold">Lagos, Nigeria</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="relative">
            <div className="bg-gray-900 rounded-md p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl" />

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <IconCircleCheck size={36} className="text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Message sent!
                  </h3>
                  <p className="text-gray-400 text-sm max-w-xs">
                    Thanks for reaching out. We'll get back to you within 24
                    hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      form.reset();
                    }}
                    className="mt-6 text-sm text-blue-400 hover:text-blue-300 underline underline-offset-2"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Send a Message
                  </h3>
                  <p className="text-gray-400 text-sm mb-8">
                    Expect a response within 24 hours.
                  </p>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Full Name"
                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Email Address"
                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                rows={4}
                                placeholder="How can we help?"
                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-blue-500 resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting
                          ? "Sending..."
                          : "Send Message"}
                        {!form.formState.isSubmitting && (
                          <IconArrowRight size={16} />
                        )}
                      </Button>
                    </form>
                  </Form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
