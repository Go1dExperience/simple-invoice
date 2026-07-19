import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../../../auth/AuthContext";
import { LoginScreen } from "../LoginScreen";
import { api } from "../../../api/client";

const renderScreen = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <MemoryRouter>
          <LoginScreen />
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  );

it("shows a validation error for an invalid email", async () => {
  renderScreen();
  fireEvent.change(screen.getByLabelText("Email address"), {
    target: { value: "nope" },
  });
  fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
  expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
});

it("logs in with valid credentials", async () => {
  vi.spyOn(api, "post").mockResolvedValue({
    data: {
      accessToken: "t",
      user: { id: "1", email: "r@x.io", fullname: "R" },
    },
  });
  renderScreen();
  fireEvent.change(screen.getByLabelText("Email address"), {
    target: { value: "r@x.io" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "Password123" },
  });
  fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
  await waitFor(() =>
    expect(api.post).toHaveBeenCalledWith("/auth/login", {
      email: "r@x.io",
      password: "Password123",
    }),
  );
});
