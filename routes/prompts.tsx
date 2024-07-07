import { Handlers, PageProps } from '$frish/server.ts';
import { supabaseClient } from '../utils/supabaseClient.ts';
import { useState } from 'preact/hooks';

interface Prompt {
  id: number;
  project_id: number;
  version_number: number;
  prompt_content: string;
  created_at: string;
  stage_id: number;
  live: boolean;
}

export const handler: Handlers<{ prompts: Prompt[] }, { projectId: string } = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const projectId = url.searchParams.get('project_id') || '1';

    const { data: prompts, error } = await supabaseClient
      .from('_oraki_eu.prompts_history')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching prompts:', info,error);
      return ctx.renderNotFound();
    }

    return ctx.render({ prompts });
  },
};

export default function PromptsPage({ data }: PageProps<{ prompts: Prompt[] }>) {
  const [projectId, setProjectId] = useState('');
  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setProjectId(target.value);
  };

  return (
    <div>
      <h1>Latest Prompts</h1>
      <label for="projectId">
        Project ID: <input type="text" value={projectId} onInput={handleInputChange} />
      </label>
      <table class="widt-full border-collapse-2 my-2">
        <thead>
          <tr>
            <th class="p-4">Version</th>
            <th class="p-4">Content</th>
            <th class="p-4">Created At</th>
          </tr>
        </thead>
        <tbody>
          {data.prompts.map(prompt => (
            <tr key={prompt.id}>
              <td class="p-4">{prompt.version_number}</td>
              <td class="p-4">{prompt.prompt_content}</td>
              <td class="p-4">{new Date(prompt.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .my-2 {
          margin-top: 15px;
        }

        th, td {
          padding: 5px;
        }
        th {
          background-color: #f0f0f0;
          color: #000000;
          text-align: left;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
