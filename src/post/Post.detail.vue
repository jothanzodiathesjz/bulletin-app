<template>
  <div class="w-full h-full flex flex-col overflow-y-auto lg:px-2">
    <ReactionList :data="reactions" @close="reactions = null"/>

    <div class="px-4 py-4">
      <ArrowLeftIcon @click="$router.back()" class="w-5 h-5" />
    </div>
    <div v-if="data" class="px-4 py-2 w-full h-full flex flex-col gap-4">
      <span class="font-bold text-2xl">{{ data?.title }}</span>
      <div class="w-full flex flex-row gap-3 items-center">
        <Avatar :size="'sm'" class="bg-neutral-80">
          <AvatarFallback class="font-bold">{{
            data.user.fullname?.charAt(0)
          }}</AvatarFallback>
        </Avatar>
        <span class="text-dark-main font-medium">{{ data.user.fullname }}</span>
      </div>
      <div v-html="data?.body.replace(/\n/g, '<br />')"></div>
      <div
        class="w-full flex flex-row justify-between items-center border-b pb-2"
      >
        <span class="text-dark-pressed text-sm"
          >{{ data.viewcount }} Views</span
        >
        <span class="text-dark-pressed text-sm">{{
          new Date(data?.created_at!)
            .toLocaleDateString("id", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })
            .replace("pukul", ":")
        }}</span>
      </div>
      <div class="w-full flex flex-row">
        <div class="w-full flex flex-row gap-2 items-center">
          <button
            v-for="(emot, index) in data.reactions.slice(0, 3)"
            :key="index"
            class="border rounded-full p-1 hover:scale-110 transition-all"
            @click=""
          >
            {{ emot.emoji }}
          </button>
          <span @click="reactions = data.reactions" class="text-dark-main text-sm underline underline-offset-4 cursor-pointer hover:text-blue-500 transition-all duration-300">{{
            formatReactions(data.reactions)
          }}</span>
        </div>
        <Popover @update:open="openEmoji = !openEmoji">
          <PopoverTrigger>
            <FaceIcon class="h-5 w-5 hover:scale-105" />
          </PopoverTrigger>
          <PopoverContent :align="'end'" class="">
            <div v-if="reactionSubmiting" class="w-full h-full">
                  <ReloadIcon
              class="w-4 h-4 mr-2 animate-spin"
            />
            </div>
            <div v-else class="w-full flex flex-row flex-wrap gap-2">
              <button
                v-for="(e, k) in Emoji"
                :key="k"
                class="text-2xl border rounded-full p-1 hover:scale-110 transition-all"
                @click="createReaction(e)"
              >
                {{ e }}
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div class="w-full flex flex-col items-end gap-2">
        <span class="text-start">Comment</span>
        <Textarea
          :value="userComment"
          @input="(v) => (userComment = v)"
          class="bg-white"
          placeholder="Type your message here."
        />
        <ButtonBulletin
          :disabled="commentSubmiting"
          @click="createComment()"
          class="w-32"
        >
          <ReloadIcon
            v-if="commentSubmiting"
            class="w-4 h-4 mr-2 animate-spin"
          />
          Coment
        </ButtonBulletin>
      </div>
      <div class="w-full flex flex-col gap-5 pb-7 mb-8">
        <div
          v-for="(comments, i) in data.comments.toSorted((a, b) =>
            b.created_at.localeCompare(a.created_at)
          )"
          :key="i"
          class="w-full flex flex-row items-start justify-start gap-2"
        >
          <Avatar :size="'sm'" class="bg-neutral-80">
            <AvatarFallback class="font-bold">{{
              comments.user.username.charAt(0)
            }}</AvatarFallback>
          </Avatar>
          <div class="w-full flex flex-col gap-3">
            <div class="flex flex-col w-full">
              <span class="font-bold">{{ comments?.user?.username }}</span>
              <span class="text-dark-main text-sm">{{
                new Date(comments?.created_at!)
                  .toLocaleDateString("id", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })
                  .replace("pukul", ":")
              }}</span>
            </div>
            <div v-html="comments.content.replace(/\n/g, '<br />')"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="w-full h-[50vh] flex justify-center items-center">
      <span class="font-bold animate-pulse"> Loading... </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from "@/components/ui/avatar/Avatar.vue";
import AvatarFallback from "@/components/ui/avatar/AvatarFallback.vue";
import container from "@/di";
import type { PostWithCommentsAndTags } from "@/domain/Post";
import { TOKENS } from "@/tokens";
import { ArrowLeftIcon, ReloadIcon, FaceIcon } from "@radix-icons/vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ButtonBulletin from "@/components/extra/button/Button.bulletin.vue";
import { Emoji } from "../emoji/Emoji";
import { formatReactions } from "@/utils/FormatEmoji";
import ReactionList from "./ReactionList.vue";
import type { EmojiAttributes } from "@/domain/Emoji";

type StateAttributes = "LOADING" | "SUCCESS" | "ERROR";
const route = useRoute();
const state = ref<StateAttributes>("LOADING");

const repository = container.get(TOKENS.PostRepository);
const emoji_repository = container.get(TOKENS.EmojiRepository);

const data = ref<PostWithCommentsAndTags | null>(null);
const userComment = ref("");
const commentSubmiting = ref(false);
const selected_emoji = ref("");
const openEmoji = ref(false);
const reactions = ref<EmojiAttributes[] | null>(null)
const reactionSubmiting = ref(false);

async function getData() {
  state.value = "LOADING";
  try {
    data.value = await repository.get(route.params.id as string);
    state.value = "SUCCESS";
  } catch (error) {
    console.log(error);
    state.value = "ERROR";
    data.value = null;
  }
}

async function createReaction(emoji: string) {
  // if(selected_emoji.value.trim() === "")return
  reactionSubmiting.value = true;
  try {
    const reaction = await emoji_repository.Post(
      emoji,
      Number(route.params.id.toString())
    );
    await getData()
    console.log(reaction);
    selected_emoji.value = "";
  } catch (error) {
    console.log(error)
  } finally {
    reactionSubmiting.value = false;
  }
}

async function createComment() {
  const id = JSON.parse(localStorage.getItem("user") ?? "");
  commentSubmiting.value = true;
  try {
    await repository.createComent(
      {
        content: userComment.value,
        user_id: id.id,
      },
      route.params.id as string
    );
    userComment.value = "";
  } catch (error) {
    console.log(error);
  } finally {
    getData();
    commentSubmiting.value = false;
  }
}

onMounted(async () => {
  getData();
});
</script>
