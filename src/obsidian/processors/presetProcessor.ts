import type { Options, Processor } from "../../@types";
import { CommentParser } from "../../obsidian/comment";
import { presetClass, type SlidePreset } from "../../presets";

// Resolves each slide's preset — a per-slide `<!-- slide preset="x" -->` wins
// over the deck-wide `preset:` frontmatter, and `preset="none"` opts a slide
// out of the deck default — and stamps the matching CSS class onto the slide's
// comment annotation (creating one when absent). The CSS for each class is
// injected separately by the renderer (see buildPresetCss).
export class PresetProcessor implements Processor {
    private slideCommentRegex = /<!--\s*(?:\.)?slide.*-->/;
    private parser = new CommentParser();

    process(markdown: string, options: Options): string {
        const presets = (options.presets as SlidePreset[] | undefined) ?? [];
        const deckPreset =
            typeof options.preset === "string" ? options.preset.trim() : "";

        if (
            presets.length === 0 ||
            (!deckPreset && !markdown.includes("preset"))
        ) {
            return markdown;
        }

        const byName = new Map<string, SlidePreset>();
        for (const preset of presets) {
            if (preset?.name) {
                byName.set(preset.name, preset);
            }
        }
        let output = markdown;

        for (const slide of this.eachSlide(markdown, options)) {
            if (!slide.trim()) {
                continue;
            }
            const newSlide = this.transformSlide(slide, deckPreset, byName);
            if (newSlide !== slide) {
                output = output.split(slide).join(newSlide);
            }
        }
        return output;
    }

    private *eachSlide(markdown: string, options: Options): Generator<string> {
        for (const group of markdown.split(
            new RegExp(options.separator, "gmi"),
        )) {
            yield* group.split(new RegExp(options.verticalSeparator, "gmi"));
        }
    }

    private transformSlide(
        slide: string,
        deckPreset: string,
        byName: Map<string, SlidePreset>,
    ): string {
        const hasComment = this.slideCommentRegex.test(slide);
        let comment = hasComment
            ? this.parser.parseLine(this.slideCommentRegex.exec(slide)?.[0])
            : null;

        const perSlide = comment?.getAttribute("preset")?.trim();
        let name: string;
        if (perSlide != null) {
            // An explicit per-slide preset. Unknown names are left untouched —
            // they may not be ours to interpret.
            if (perSlide !== "none" && !byName.has(perSlide)) {
                return slide;
            }
            name = perSlide === "none" ? "" : perSlide;
        } else {
            name = byName.has(deckPreset) ? deckPreset : "";
        }

        // Nothing to do: no preset and no stray attribute to clean up.
        if (!name && perSlide == null) {
            return slide;
        }

        const preset = name ? byName.get(name) : undefined;
        const clazz = name ? presetClass(name) : "";

        if (!comment) {
            if (!clazz) {
                return slide;
            }
            comment = this.parser.parseLine(`<!-- slide class="${clazz}" -->`);
            this.applyBackground(comment, preset);
            return `${this.parser.commentToString(comment)}\n${slide}`;
        }

        comment.deleteAttribute("preset");
        if (clazz && !comment.hasClass(clazz)) {
            comment.addClass(clazz);
        }
        this.applyBackground(comment, preset);
        return slide.replace(
            this.slideCommentRegex,
            this.parser.commentToString(comment),
        );
    }

    // reveal.js paints slide backgrounds from a separate layer, so a preset's
    // background has to go through the `bg` attribute (-> data-background-color),
    // not just CSS. A background already set on the slide wins.
    private applyBackground(
        comment: ReturnType<CommentParser["parseLine"]>,
        preset: SlidePreset | undefined,
    ): void {
        if (
            !comment ||
            !preset?.background ||
            comment.hasAttribute("bg") ||
            comment.hasAttribute("data-background-color") ||
            comment.hasAttribute("data-background-image")
        ) {
            return;
        }
        comment.addAttribute("bg", preset.background.replace(/[<>"]/g, ""));
    }
}
