"use client";

import * as React from "react";
import Image from "next/image";
import Blockies from "react-blockies";
import { UserCircle2, UploadCloud, Edit, Coins, Bot, Calendar, Mail } from 'lucide-react';

import { NeonButton } from "@/components/neon-button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAccount, useEnsName, useEnsAvatar, useChainId } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Separator } from "@/components/ui/separator";
import CustomWalletButton from "@/components/custom-connect";

export default function ProfilePage() {
  /* ---------- wagmi wallet state ---------- */
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName ?? undefined });

  /* ---------- local editable profile ---------- */
  const [profile, setProfile] = React.useState({
    name: ensName ?? "Unnamed",
    email: "",
    bio: "",
    joined: "Jun 2025",
  });
  const [draft, setDraft] = React.useState(profile);
  const [editOpen, setEditOpen] = React.useState(false);

  /* credits mock */
  const [credits] = React.useState(120);

  /* sync ENS name when it arrives */
  React.useEffect(() => {
    if (ensName) {
      setProfile((p) => ({ ...p, name: ensName }));
      setDraft((p) => ({ ...p, name: ensName }));
    }
  }, [ensName]);

  /* save */
  const onSave = () => {
    setProfile(draft);
    setEditOpen(false);
  };

  /* ---------- render ---------- */
  const displayAddr = `${address?.slice(0, 6)}…${address?.slice(-4)}`;
  const avatarNode = ensAvatar ? (
    <Image
      src={ensAvatar || "/placeholder.svg"}
      alt="avatar"
      fill
      className="rounded-full object-cover shadow-lg"
    />
  ) : (
    <Blockies
      seed={address!?.toLowerCase()}
      size={10}
      scale={8}
      className="rounded-full shadow-lg"
    />
  );

  if (!isConnected)
    return (
      <section className="relative isolate flex min-h-[78vh] items-center justify-center overflow-hidden px-4 py-16">
        {/* ==== soft neon glows ==== */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[40rem] w-[40rem] rounded-full bg-fuchsia-500/10 blur-3xl opacity-60 mix-blend-screen" />
          <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 h-[28rem] w-[28rem] rounded-full bg-sky-400/10 blur-3xl opacity-60 mix-blend-screen" />
        </div>

        {/* ==== glass card ==== */}
        <div
          className="
            relative z-10 w-full max-w-md
            rounded-2xl border border-white/30 bg-white/15 backdrop-blur-md
            p-10 text-center
            shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),0_6px_24px_rgba(0,0,0,0.18)]
            before:absolute before:inset-0 before:-z-10 before:rounded-[inherit]
            before:opacity-0 before:transition before:duration-300
            hover:before:opacity-60 hover:before:blur-lg
            animate-fade-in
          "
        >
          {/* icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-cyan-400 text-white shadow-inner">
            <Bot className="h-8 w-8" />
          </div>
 <h2 className="bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-2xl font-bold text-transparent">
            Connect your Wallet
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-600">
            Link a wallet to create, train&nbsp;and run neural agents on-chain.
          </p>

          {/* RainbowKit button */}
          <div className="mt-10 flex justify-center">
            <CustomWalletButton
              
            />
          </div>
        </div>
      </section>
    );

  return (
    <section className="relative w-full min-h-screen overflow-hidden py-16 px-4 md:px-6">
      <SidebarTrigger className="absolute left-4 top-4 z-20" />

      {/* — glows — */}
      <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[60rem] w-[60rem] rounded-full bg-fuchsia-500/10 blur-3xl opacity-60 mix-blend-screen" />
          <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 h-[28rem] w-[28rem] rounded-full bg-sky-400/30 blur-3xl opacity-60 mix-blend-screen" />
                  <div className="absolute bottom-0 left-0 translate-x-1/4 translate-y-1/4 h-[28rem] w-[28rem] rounded-full bg-pink-400/30 blur-3xl opacity-60 mix-blend-screen" />

        </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-8 animate-fade-in">
        {/* -------- profile header -------- */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
          {/* Avatar section */}
          <div className="flex flex-col items-center">
            <div className="relative rounded-full ring-4 ring-white/30 ring-offset-2 ring-offset-white/10 shadow-xl">
              {avatarNode}
            </div>
            
            {/* chain badge */}
            <Badge
              variant="secondary"
             className="mt-2 text-xs font-medium"
            >
              Chain ID: {chainId ?? "Unknown"}
            </Badge>
          </div>
          
          {/* Profile info */}
          <div className="flex-1 flex flex-col items-center md:items-start">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {profile.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{displayAddr}</p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              {profile.joined && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Joined {profile.joined}</span>
                </div>
              )}
              {profile.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{profile.email}</span>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <NeonButton title="Edit Profile">
                    <Edit className="mr-2 h-4 w-4" /> 
                  </NeonButton>
                </DialogTrigger>
                <DialogContent className="bg-white/95 border-white/10 backdrop-blur-xl">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Update your profile information
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-3">
                    <div className="space-y-2">
                      <Label>Display Name</Label>
                      <Input
                        value={draft.name}
                        onChange={(e) =>
                          setDraft({ ...draft, name: e.target.value })
                        }
                        className="bg-white/40"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={draft.email}
                        onChange={(e) =>
                          setDraft({ ...draft, email: e.target.value })
                        }
                        className="bg-white/40"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Bio</Label>
                      <Textarea
                        value={draft.bio}
                        onChange={(e) =>
                          setDraft({ ...draft, bio: e.target.value })
                        }
                        className="min-h-[100px] bg-white/40"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={onSave} className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white border-none hover:opacity-90">
                        <UploadCloud className="mr-2 h-4 w-4" /> Save Changes
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
             {/*  <NeonButton title="Disconnect">
                <LogOut className="mr-2 h-4 w-4" />
                
              </NeonButton> */}
            </div>
          </div>
        </div>

        {/* -------- main content -------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile details card */}
          <Card className="md:col-span-2 rounded-2xl border border-white/30 bg-white/15 backdrop-blur-md p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),0_6px_22px_rgba(0,0,0,0.14)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5),0_8px_30px_rgba(0,0,0,0.18)] transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-gray-900">Profile Details</CardTitle>
            </CardHeader>
            
            <CardContent className="pt-4">
              {profile.bio ? (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Bio</Label>
                  <p className="text-sm text-gray-700 leading-relaxed">{profile.bio}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <UserCircle2 className="h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700">No bio yet</h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-xs">
                    Tell others about yourself by adding a bio to your profile.
                  </p>
                 <NeonButton 
                    onClick={() => setEditOpen(true)}
                    title="Add Bio"
                    className="mt-4"
                  >
                    
                  </NeonButton>
                </div>
              )}
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Account Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Wallet Address</p>
                    <p className="text-sm font-mono">{displayAddr}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Chain ID</p>
                    <p className="text-sm">{chainId ?? "Unknown"}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Joined</p>
                    <p className="text-sm">{profile.joined}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* -------- credits card -------- */}
          <Card className="rounded-2xl border border-white/30 bg-white/15 backdrop-blur-md p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),0_6px_22px_rgba(0,0,0,0.14)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5),0_8px_30px_rgba(0,0,0,0.18)] transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-cyan-400 text-white shadow-inner">
                  <Coins className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl text-gray-900">Credits</CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500">Available</p>
                <span className="text-3xl font-extrabold text-gray-900">
                  {credits}
                </span>
              </div>

              <div className="space-y-2">
                <div className="h-3 w-full rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 transition-all duration-700 ease-in-out"
                    style={{ width: `${Math.min((credits / 500) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{credits} used</span>
                  <span>500 free monthly</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center ">
              <div className="mt-8 flex">
                <NeonButton 
                  onClick={() => alert("on-ramp flow")}
                  title=" Refill with&nbsp;USDC"
                >
                 
                </NeonButton>
              </div>
              
              <div className="mt-6">
               <NeonButton title="Transaction History"></NeonButton>
              </div></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
