import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Form, redirect } from "react-router";
import type { Route } from "../+types/root";
import { Input } from "~/components/ui/input";

export async function clientAction({ request}: Route.ClientActionArgs) {
  const formData = await request.formData()
  await fetch(`/api/admin-login`, {
    method: 'POST',
    body: formData,
  })
  return redirect("/chat")
}

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
  className={cn(
    "relative mx-auto mt-10 w-full max-w-md",
    className
  )}
  {...props}
>
  {/* Glow */}
  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 opacity-40 blur-xl" />

  <Card className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
    <CardHeader className="text-center">
      <CardTitle className="text-2xl font-semibold tracking-widest text-white">
        ADMIN ACCESS
      </CardTitle>
      <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">
        Secure Login
      </p>
    </CardHeader>

    <CardContent>
      <Form method="post" className="space-y-6">
        <FieldGroup className="space-y-5">
          {/* Username */}
          <Field className="space-y-1">
            <FieldLabel
              htmlFor="username"
              className="text-xs uppercase tracking-widest text-slate-400"
            >
              Username
            </FieldLabel>
            <Input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Enter username"
              className="rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-slate-500
                transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
            />
          </Field>

          {/* Password */}
          <Field className="space-y-1">
            <FieldLabel
              htmlFor="password"
              className="text-xs uppercase tracking-widest text-slate-400"
            >
              Password
            </FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-slate-500
                transition-all focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40"
            />
          </Field>

          {/* Button */}
          <Field>
            <Button
              type="submit"
              className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600
                py-3 text-sm font-medium tracking-widest text-white transition-all
                hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/30 active:scale-100"
            >
                
              <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="relative">LOGIN</span>
              
              
            </Button>
          </Field>
        </FieldGroup>
      </Form>

      
    </CardContent>
  </Card>
</div>

  )
}
 