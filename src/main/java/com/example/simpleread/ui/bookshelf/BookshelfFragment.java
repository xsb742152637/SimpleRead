package com.example.simpleread.ui.bookshelf;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;

import com.example.simpleread.R;

public class BookshelfFragment extends Fragment {

    private BookshelfViewModel bookshelfViewModel;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        bookshelfViewModel =
                new ViewModelProvider(this).get(BookshelfViewModel.class);
        View root = inflater.inflate(R.layout.fragment_bookshelf, container, false);
        final TextView textView = root.findViewById(R.id.text_bookshelf);
        bookshelfViewModel.getText().observe(getViewLifecycleOwner(), new Observer<String>() {
            @Override
            public void onChanged(@Nullable String s) {
                textView.setText(s);
            }
        });
        return root;
    }
}