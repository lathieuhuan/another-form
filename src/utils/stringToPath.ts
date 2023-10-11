import compact from "./compact";

// export default (input: string): string[] => compact(input.replace(/["|']|\]/g, "").split(/\.|\[/));
export default (input: string): string[] => compact(input.split(/[[\].]+/));
